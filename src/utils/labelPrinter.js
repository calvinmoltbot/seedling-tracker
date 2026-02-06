/**
 * Phomemo D30 label image generator + Web Share API integration.
 *
 * D30 specs: 203 DPI, 12mm print head = 96px wide.
 * We target 14x50mm labels: printable ~12x47mm = 96x376 pixels.
 * Image is generated landscape (376 x 96) for the label feed direction.
 */

const LABEL_WIDTH = 376
const LABEL_HEIGHT = 96

/**
 * Generate a pixel-perfect PNG blob for a D30 label.
 */
export async function generateLabelBlob(sowing) {
  const canvas = document.createElement('canvas')
  canvas.width = LABEL_WIDTH
  canvas.height = LABEL_HEIGHT
  const ctx = canvas.getContext('2d')

  // Disable anti-aliasing for crisp thermal output
  ctx.imageSmoothingEnabled = false

  // White background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, LABEL_WIDTH, LABEL_HEIGHT)

  // Sowing code — large mono, left side
  ctx.fillStyle = '#000000'
  ctx.font = 'bold 36px monospace'
  ctx.textBaseline = 'top'
  ctx.fillText(sowing.sowing_code, 8, 6)

  // Divider line
  ctx.fillRect(8, 46, 240, 2)

  // Seed name
  ctx.font = 'bold 20px sans-serif'
  ctx.fillText(truncateText(ctx, sowing.seed_name, 240), 8, 54)

  // Variety (if present) or date
  ctx.font = '14px sans-serif'
  if (sowing.variety) {
    ctx.fillText(truncateText(ctx, sowing.variety, 170), 8, 78)
    // Date on the right
    ctx.textAlign = 'right'
    ctx.fillText(formatDate(sowing.sowing_date), 258, 78)
    ctx.textAlign = 'left'
  } else {
    ctx.fillText(formatDate(sowing.sowing_date), 8, 78)
  }

  // QR-style marker — simple sowing code rendered as a visual block on the right
  // Since we're keeping it simple (no QR library), draw a bold code block
  drawCodeBlock(ctx, sowing.sowing_code, 272, 4, 96, 88)

  return new Promise(resolve => {
    canvas.toBlob(resolve, 'image/png')
  })
}

/**
 * Share a label image via Web Share API, with download fallback.
 * Returns true if shared/downloaded successfully.
 */
export async function shareLabelImage(sowing) {
  const blob = await generateLabelBlob(sowing)
  const filename = `label-${sowing.sowing_code}.png`
  const file = new File([blob], filename, { type: 'image/png' })

  // Try Web Share API (works on iOS Safari 15+)
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file] })
      return true
    } catch (err) {
      // User cancelled — that's fine
      if (err.name === 'AbortError') return false
    }
  }

  // Fallback: trigger download
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  return true
}

/**
 * Generate and share multiple labels as separate images.
 */
export async function shareMultipleLabels(sowings) {
  const files = await Promise.all(
    sowings.map(async (s) => {
      const blob = await generateLabelBlob(s)
      return new File([blob], `label-${s.sowing_code}.png`, { type: 'image/png' })
    })
  )

  if (navigator.canShare && navigator.canShare({ files })) {
    try {
      await navigator.share({ files })
      return true
    } catch (err) {
      if (err.name === 'AbortError') return false
    }
  }

  // Fallback: download each
  for (const file of files) {
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  return true
}

// --- Helpers ---

function truncateText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text
  let t = text
  while (t.length > 0 && ctx.measureText(t + '...').width > maxWidth) {
    t = t.slice(0, -1)
  }
  return t + '...'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
}

/**
 * Draw a bold visual code block on the right side of the label.
 * This makes the label instantly identifiable and scannable by eye.
 */
function drawCodeBlock(ctx, code, x, y, w, h) {
  ctx.fillStyle = '#000000'

  // Border
  ctx.fillRect(x, y, w, 3)
  ctx.fillRect(x, y + h - 3, w, 3)
  ctx.fillRect(x, y, 3, h)
  ctx.fillRect(x + w - 3, y, 3, h)

  // Code text centered vertically
  ctx.save()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = 'bold 28px monospace'
  ctx.fillText(code, x + w / 2, y + h / 2)
  ctx.restore()
}

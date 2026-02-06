export default function PhotoUpload({ photo, onCapture, label = 'Take photo' }) {
  return (
    <div className="space-y-3">
      {photo && (
        <img
          src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)}
          alt=""
          className="w-full rounded-2xl object-cover aspect-[4/3] ring-1 ring-soil-200"
        />
      )}
      <label className="block w-full bg-white border-2 border-dashed border-soil-300 rounded-2xl py-10 text-center cursor-pointer active:bg-soil-50 transition-colors">
        <div className="flex flex-col items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-soil-400"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          <span className="text-soil-500 text-sm font-medium">
            {photo ? 'Tap to retake' : label}
          </span>
        </div>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={e => e.target.files[0] && onCapture(e.target.files[0])}
          className="hidden"
        />
      </label>
    </div>
  )
}

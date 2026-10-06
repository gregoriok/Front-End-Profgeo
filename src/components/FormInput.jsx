export function FormInput({
  label,
  register,
  errors,
  fieldName,
  type = 'text',
  placeholder = '',
  required = false,
  validate = null,
  help = '',
  ...props
}) {
  const error = errors[fieldName];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          {...register(fieldName, {
            required: required ? `${label} é obrigatório` : false,
            validate: validate
          })}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition bg-white text-gray-900 ${
            error
              ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
              : 'border-profgeo-200 focus:ring-profgeo-200 focus:border-profgeo-400'
          }`}
          {...props}
        />

        {error && (
          <span className="absolute right-3 top-3 text-red-600 text-lg">✕</span>
        )}
        {!error && required && (
          <span className="absolute right-3 top-3 text-green-600 text-lg hidden group-valid:inline">✓</span>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
          <span>⚠️</span>
          {error.message}
        </p>
      )}

      {help && !error && (
        <p className="text-gray-500 text-xs mt-1">💡 {help}</p>
      )}
    </div>
  );
}

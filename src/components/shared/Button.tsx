const Button = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
  loading,
}: any) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
          relative
          disabled:opacity-70
          disabled:cursor-not-allowed
          rounded-lg
          transition
          px-4
          w-full
          ${outline ? "bg-white" : "bg-pink-500"}
          ${outline ? "border-black" : "border-pink-500"}
          ${outline ? "text-black" : "text-white"}
          ${small ? "text-sm" : "text-md"}
          ${small ? "py-1" : "py-3"}
          ${small ? "font-light" : "font-semibold"}
          ${small ? "border-[1px]" : "border-2"}
          hover:${outline ? "bg-gray-100" : "bg-pink-500"}
        `}
    >
      {Icon && (
        <Icon
          size={24}
          className="
              absolute
              left-4
              top-3
            "
        />
      )}
      {loading ? (
        <span className="loading loading-spinner text-warning"></span>
      ) : (
        label
      )}
    </button>
  );
};

export default Button;

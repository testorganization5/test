import "./Avatar.css";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: number;
}

export function Avatar({ src, name = "", size = 40 }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {src ? <img src={src} alt={name} /> : <span>{initials}</span>}
    </span>
  );
}

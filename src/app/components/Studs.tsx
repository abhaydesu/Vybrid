export default function Studs({ count = 2 }: { count?: number }) {
  return (
    <span className="studs" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="stud" />
      ))}
    </span>
  );
}

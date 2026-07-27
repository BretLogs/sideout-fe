type PoweredByStapplProps = {
  className?: string;
};

export function PoweredByStappl({ className = "" }: PoweredByStapplProps) {
  return (
    <p
      className={`text-center text-[10px] text-sideout-cream/60 ${className}`.trim()}
    >
      Powered by{" "}
      <a
        href="https://stapplinc.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 transition-opacity hover:opacity-90"
      >
        Stappl Inc.
      </a>
    </p>
  );
}

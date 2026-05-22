import { formatHistoryDate } from "./formatHistoryDate";

type CardHistoryItemProps = {
  completedDate: string;
  redeemedDate?: string | null;
  onRedeem?: () => void;
};

export function CardHistoryItem({
  completedDate,
  redeemedDate,
  onRedeem,
}: CardHistoryItemProps) {
  const isRedeemed = Boolean(redeemedDate);

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-sideout-cream px-4 py-4 text-sideout-green">
      <div className="min-w-0 space-y-1 uppercase tracking-wide">
        <p className="text-[11px] font-bold leading-tight">
          Card completed {formatHistoryDate(completedDate)}
        </p>
        {redeemedDate && (
          <p className="text-[10px] font-normal leading-tight">
            Card redeemed {formatHistoryDate(redeemedDate)}
          </p>
        )}
      </div>

      {isRedeemed ? (
        <span className="shrink-0 rounded-full bg-sideout-green px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-sideout-cream">
          Redeemed
        </span>
      ) : (
        <button
          type="button"
          onClick={onRedeem}
          aria-haspopup="dialog"
          className="shrink-0 rounded-full bg-sideout-green px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-sideout-gold transition-opacity hover:opacity-90"
        >
          Redeem
        </button>
      )}
    </div>
  );
}

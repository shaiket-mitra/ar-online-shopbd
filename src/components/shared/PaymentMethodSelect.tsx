import { Check, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type PaymentMethod = "COD" | "BKASH" | "NAGAD";

const PAYMENT_METHODS: { label: string; value: PaymentMethod }[] = [
  { label: "Cash On Delivery", value: "COD" },
  { label: "bKash", value: "BKASH" },
  { label: "Nagad", value: "NAGAD" },
];

export function PaymentMethodSelect({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (v: PaymentMethod) => void;
}) {
  const selectedLabel =
    PAYMENT_METHODS.find((m) => m.value === value)?.label ?? "Select";

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold tracking-wider text-gray-700 uppercase">
        Payment Method
      </p>

      <Select value={value} onValueChange={(v) => onChange(v as PaymentMethod)}>
        <SelectTrigger
          className="
            h-11 w-full
            rounded-xl
            border border-gray-200
            bg-white
            px-4
            text-sm font-medium text-gray-900
            shadow-sm
            outline-none
            focus:ring-2 focus:ring-pink-400 focus:border-pink-400
            data-[state=open]:ring-2 data-[state=open]:ring-pink-200
          "
        >
          <div className="flex w-full items-center justify-between">
            <SelectValue>{selectedLabel}</SelectValue>

            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </SelectTrigger>

        <SelectContent
          position="popper"
          sideOffset={6}
          className="
            rounded-xl
            border border-gray-200
            bg-white
            p-1
            shadow-xl
          "
        >
          {PAYMENT_METHODS.map((m) => (
            <SelectItem
              key={m.value}
              value={m.value}
              className="
                rounded-lg
                py-2.5
                text-sm
                focus:bg-gray-50
                data-[highlighted]:bg-gray-50
              "
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-gray-900">{m.label}</span>

                {value === m.value ? (
                  <Check className="h-4 w-4 text-gray-900" />
                ) : (
                  <span className="h-4 w-4" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ── Schema ──────────────────────────────────────────────────────────────────

const productRowSchema = z.object({
  productId: z.string().min(1, "Please select a variant"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

const formSchema = z.object({
  customerName: z.string().min(2, "Please enter your full name"),
  companyName: z.string().min(2, "Please enter your company name"),
  email: z.string().email("Please enter a valid email address"),
  city: z.string().min(2, "Please enter your city / address"),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .regex(/^[+\d\s\-()\\.]{7,20}$/, "Please enter a valid phone number"),
  products: z.array(productRowSchema).min(1),
});

type FormValues = z.infer<typeof formSchema>;

// ── Per-row state ─────────────────────────────────────────────────────────

interface Variant {
  id: string;
  capacity: string;
  code: string;
  mrp: number;
}

interface RowState {
  groupCategory: string;
  productName: string;
  productNames: string[];
  variants: Variant[];
  loadingNames: boolean;
  loadingVariants: boolean;
}

const EMPTY_ROW: RowState = {
  groupCategory: "",
  productName: "",
  productNames: [],
  variants: [],
  loadingNames: false,
  loadingVariants: false,
};

// ── Capacity formatter ────────────────────────────────────────────────────

function formatCapacity(cap: string): string {
  if (!cap.trim()) return cap;
  // Already has letters (e.g. "1.00T") or slashes (e.g. "2000/3000") → show as-is
  if (/[a-zA-Z\/]/.test(cap)) return cap;
  const num = parseFloat(cap);
  if (isNaN(num)) return cap;
  // Very large numbers are part/item codes, not real capacities
  if (num > 99999) return cap;
  if (num > 99) return `${cap} kgs`;
  return `${cap} tons`;
}

// ── Spinner ───────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg className="animate-spin w-4 h-4 text-[#1e3a5f]" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────

export default function EnquiryForm() {
  const [groupCategories, setGroupCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [rowStates, setRowStates] = useState<RowState[]>([EMPTY_ROW]);
  // Keep a ref so async handlers always read the latest row states
  const rowStatesRef = useRef(rowStates);
  rowStatesRef.current = rowStates;

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      companyName: "",
      email: "",
      city: "",
      phone: "",
      products: [{ productId: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "products" });

  // Fetch group categories once on mount
  useEffect(() => {
    fetch("/api/products?groupCategories=true")
      .then((r) => r.json())
      .then((cats: string[]) => setGroupCategories(cats))
      .catch(() => {})
      .finally(() => setCategoriesLoading(false));
  }, []);

  // L1 → L2: category selected — fetch product names for this row
  const handleGroupCategoryChange = useCallback(
    async (index: number, groupCategory: string) => {
      setValue(`products.${index}.productId`, "");
      setRowStates((prev) => {
        const next = [...prev];
        next[index] = { ...EMPTY_ROW, groupCategory, loadingNames: !!groupCategory };
        return next;
      });

      if (!groupCategory) return;

      try {
        const res = await fetch(
          `/api/products?groupCategory=${encodeURIComponent(groupCategory)}&productNames=true`
        );
        const names: string[] = await res.json();
        setRowStates((prev) => {
          const next = [...prev];
          next[index] = { ...EMPTY_ROW, groupCategory, productNames: names };
          return next;
        });
      } catch {
        setRowStates((prev) => {
          const next = [...prev];
          next[index] = { ...EMPTY_ROW, groupCategory };
          return next;
        });
      }
    },
    [setValue]
  );

  // L2 → L3: product name selected — fetch variants for this row
  const handleProductNameChange = useCallback(
    async (index: number, productName: string) => {
      setValue(`products.${index}.productId`, "");
      const { groupCategory, productNames } = rowStatesRef.current[index];

      setRowStates((prev) => {
        const next = [...prev];
        next[index] = {
          groupCategory,
          productName,
          productNames,
          variants: [],
          loadingNames: false,
          loadingVariants: !!productName,
        };
        return next;
      });

      if (!productName) return;

      try {
        const res = await fetch(
          `/api/products?groupCategory=${encodeURIComponent(groupCategory)}&productName=${encodeURIComponent(productName)}`
        );
        const variants: Variant[] = await res.json();
        setRowStates((prev) => {
          const next = [...prev];
          next[index] = {
            groupCategory,
            productName,
            productNames,
            variants,
            loadingNames: false,
            loadingVariants: false,
          };
          return next;
        });
      } catch {
        setRowStates((prev) => {
          const next = [...prev];
          next[index] = {
            groupCategory,
            productName,
            productNames,
            variants: [],
            loadingNames: false,
            loadingVariants: false,
          };
          return next;
        });
      }
    },
    [setValue]
  );

  function handleAddRow() {
    append({ productId: "", quantity: 1 });
    setRowStates((prev) => [...prev, EMPTY_ROW]);
  }

  function handleRemoveRow(index: number) {
    remove(index);
    setRowStates((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setServerError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/send-quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.debug ?? json.error ?? "Unknown error");
      setSuccess(json.quotationRef);
      reset();
      setRowStates([EMPTY_ROW]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setServerError(
        "Something went wrong while sending your quotation. Please try again or email us directly at elmechin@gmail.com"
      );
      console.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="bg-green-50 border border-green-300 rounded-2xl p-10 text-center max-w-lg mx-auto">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-extrabold text-green-800 mb-3">Quotation Sent!</h2>
        <p className="text-green-700 mb-2">
          Your quotation has been emailed to you. Please check your inbox.
        </p>
        <p className="text-sm text-green-600 font-mono font-medium mb-6">
          Reference: {success}
        </p>
        <p className="text-sm text-green-700 mb-6">
          Our team will follow up shortly. You can reply directly to the quotation email.
        </p>
        <button
          onClick={() => setSuccess(null)}
          className="bg-[#1e3a5f] hover:bg-[#152b47] text-white font-bold px-6 py-3 rounded transition-colors text-sm"
        >
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-8"
      aria-label="Quotation enquiry form"
    >
      {/* ── Contact Details ──────────────────────────────────────────── */}
      <fieldset className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <legend className="text-lg font-bold text-[#1e3a5f] mb-6 px-1">
          Your Details
        </legend>
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label htmlFor="customerName" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="customerName"
              type="text"
              autoComplete="name"
              placeholder="John Smith"
              {...register("customerName")}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition"
            />
            {errors.customerName && (
              <p className="mt-1.5 text-xs text-red-600">{errors.customerName.message}</p>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              id="companyName"
              type="text"
              autoComplete="organization"
              placeholder="ABC Manufacturing Ltd"
              {...register("companyName")}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition"
            />
            {errors.companyName && (
              <p className="mt-1.5 text-xs text-red-600">{errors.companyName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              {...register("email")}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91 9XXXXXXXXX"
              {...register("phone")}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition"
            />
            {errors.phone && (
              <p className="mt-1.5 text-xs text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* City / Address */}
          <div className="sm:col-span-2">
            <label htmlFor="city" className="block text-sm font-semibold text-slate-700 mb-1.5">
              City / Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="city"
              rows={2}
              autoComplete="address-level2"
              placeholder="e.g. Chennai, Tamil Nadu"
              {...register("city")}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition resize-none"
            />
            {errors.city && (
              <p className="mt-1.5 text-xs text-red-600">{errors.city.message}</p>
            )}
          </div>
        </div>
      </fieldset>

      {/* ── Products ─────────────────────────────────────────────────── */}
      <fieldset className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <legend className="text-lg font-bold text-[#1e3a5f] mb-2 px-1">
          Products Required
        </legend>
        <p className="text-sm text-slate-500 mb-6">
          For each product: choose a category, select the product name, then pick the specific capacity / variant.
        </p>

        <div className="space-y-4">
          {fields.map((field, index) => {
            const row = rowStates[index] ?? EMPTY_ROW;
            return (
              <div
                key={field.id}
                className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 pt-3"
              >
                {/* Row header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Product {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    disabled={fields.length === 1}
                    aria-label={`Remove product ${index + 1}`}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-red-200 text-red-400 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition disabled:opacity-25 disabled:cursor-not-allowed"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* 3 dropdowns + qty */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_90px] gap-3 items-start">
                  {/* L1: Category */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                      Category
                    </label>
                    <select
                      value={row.groupCategory}
                      onChange={(e) => handleGroupCategoryChange(index, e.target.value)}
                      disabled={categoriesLoading}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] transition disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
                      aria-label={`Category for product ${index + 1}`}
                    >
                      <option value="">— Category —</option>
                      {groupCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* L2: Product Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                      Product Name
                    </label>
                    <div className="relative">
                      <select
                        value={row.productName}
                        onChange={(e) => handleProductNameChange(index, e.target.value)}
                        disabled={!row.groupCategory || row.loadingNames}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] transition disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                        aria-label={`Product name for product ${index + 1}`}
                      >
                        <option value="">
                          {!row.groupCategory
                            ? "Select a category first"
                            : row.loadingNames
                            ? "Loading..."
                            : "— Product Name —"}
                        </option>
                        {row.productNames.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                      {row.loadingNames && <Spinner />}
                    </div>
                  </div>

                  {/* L3: Variant (capacity · code · MRP) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                      Capacity / Variant
                    </label>
                    <div className="relative">
                      <select
                        {...register(`products.${index}.productId`)}
                        disabled={!row.productName || row.loadingVariants}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] transition disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                        aria-label={`Variant for product ${index + 1}`}
                      >
                        <option value="">
                          {!row.productName
                            ? "Select a product first"
                            : row.loadingVariants
                            ? "Loading..."
                            : "— Select Variant —"}
                        </option>
                        {row.variants.map((v) => (
                          <option key={v.id} value={v.id}>
                            {formatCapacity(v.capacity)}
                            {v.code ? ` · [${v.code}]` : ""}
                          </option>
                        ))}
                      </select>
                      {row.loadingVariants && <Spinner />}
                    </div>
                    {errors.products?.[index]?.productId && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.products[index]?.productId?.message}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                      Qty
                    </label>
                    <input
                      type="number"
                      min="1"
                      defaultValue={1}
                      {...register(`products.${index}.quantity`, { valueAsNumber: true })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] transition"
                      aria-label={`Quantity for product ${index + 1}`}
                    />
                    {errors.products?.[index]?.quantity && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.products[index]?.quantity?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add row */}
        <button
          type="button"
          onClick={handleAddRow}
          className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#1e3a5f] hover:text-amber-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Another Product
        </button>
      </fieldset>

      {/* ── Note ──────────────────────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
        <strong>Note:</strong> The quotation will be emailed to your provided email address
        with indicative MRP pricing. Final pricing is subject to confirmation by our team.
      </div>

      {/* ── Server error ───────────────────────────────────────────────── */}
      {serverError && (
        <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-xl px-5 py-4">
          {serverError}
        </div>
      )}

      {/* ── Submit ────────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#1e3a5f] hover:bg-[#152b47] disabled:bg-slate-400 text-white font-bold text-base px-8 py-4 rounded-xl transition-colors flex items-center justify-center gap-3"
      >
        {submitting ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Generating &amp; Sending Quotation...
          </>
        ) : (
          "Request Quotation →"
        )}
      </button>
    </form>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ── Schema ──────────────────────────────────────────────────────────────────

const productRowSchema = z.object({
  productId: z.string().min(1, "Please complete all selections"),
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

// ── Row state ────────────────────────────────────────────────────────────────

interface ResolvedProduct {
  id: string;
  product_name: string;
  series: string;
  capacity_tonnes: number | null;
  lift_height_metres: number | null;
  suspension_type: string | null;
  trolley_range: string | null;
  indef_code: string | null;
  notes: string | null;
}

interface RowState {
  category: string;
  series: string;
  capacity: string;
  suspension: string;
  trolleyRange: string;
  lift: string;
  speedType: string;

  seriesList: string[];
  capacities: (number | null)[];
  suspensions: string[];
  trolleyRanges: string[];
  lifts: (number | null)[];
  speedTypes: string[];
  resolved: ResolvedProduct | null;

  loading: string | null;
}

const EMPTY_ROW: RowState = {
  category: "", series: "", capacity: "", suspension: "", trolleyRange: "", lift: "", speedType: "",
  seriesList: [], capacities: [], suspensions: [], trolleyRanges: [], lifts: [], speedTypes: [],
  resolved: null, loading: null,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function isTrolleyType(suspension: string) {
  return suspension.toLowerCase().includes("trolley");
}

function Spinner() {
  return (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg className="animate-spin w-4 h-4 text-[#1e3a5f]" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </span>
  );
}

function SelectField({
  label, value, onChange, options, disabled, loading, placeholder, formatOption,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: (string | number | null)[];
  disabled: boolean;
  loading: boolean;
  placeholder: string;
  formatOption?: (v: string | number | null) => string;
}) {
  const fmt = formatOption ?? ((v) => String(v ?? ""));
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || loading}
          className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] transition disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed appearance-none pr-8"
        >
          <option value="">{loading ? "Loading…" : placeholder}</option>
          {options.map((opt, i) => (
            <option key={i} value={String(opt ?? "")}>{fmt(opt)}</option>
          ))}
        </select>
        {loading && <Spinner />}
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function EnquiryForm() {
  const [categories, setCategories] = useState<string[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [rowStates, setRowStates] = useState<RowState[]>([EMPTY_ROW]);
  const rowStatesRef = useRef(rowStates);
  rowStatesRef.current = rowStates;

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, control, handleSubmit, formState: { errors }, reset, setValue } =
    useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        customerName: "", companyName: "", email: "", city: "", phone: "",
        products: [{ productId: "", quantity: 1 }],
      },
    });

  const { fields, append, remove } = useFieldArray({ control, name: "products" });

  useEffect(() => {
    fetch("/api/products?categories=true")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {})
      .finally(() => setCatLoading(false));
  }, []);

  const patchRow = useCallback((index: number, patch: Partial<RowState>) => {
    setRowStates((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }, []);

  // ── Cascade handlers ────────────────────────────────────────────────────────

  const onCategoryChange = useCallback(async (index: number, category: string) => {
    setValue(`products.${index}.productId`, "");
    setRowStates((prev) => {
      const next = [...prev];
      next[index] = { ...EMPTY_ROW, category, loading: category ? "series" : null };
      return next;
    });
    if (!category) return;
    const data = await fetch(`/api/products?series=true&category=${encodeURIComponent(category)}`).then((r) => r.json());
    patchRow(index, { seriesList: data, loading: null });
  }, [setValue, patchRow]);

  const onSeriesChange = useCallback(async (index: number, series: string) => {
    setValue(`products.${index}.productId`, "");
    const { category } = rowStatesRef.current[index];
    patchRow(index, { series, capacity: "", suspension: "", trolleyRange: "", lift: "", capacities: [], suspensions: [], trolleyRanges: [], lifts: [], resolved: null, loading: series ? "capacities" : null });
    if (!series) return;
    const data = await fetch(`/api/products?capacities=true&category=${encodeURIComponent(category)}&series=${encodeURIComponent(series)}`).then((r) => r.json());
    patchRow(index, { capacities: data, loading: null });
  }, [setValue, patchRow]);

  const onCapacityChange = useCallback(async (index: number, capacity: string) => {
    setValue(`products.${index}.productId`, "");
    const { category, series } = rowStatesRef.current[index];
    patchRow(index, { capacity, suspension: "", trolleyRange: "", lift: "", suspensions: [], trolleyRanges: [], lifts: [], resolved: null, loading: capacity ? "suspensions" : null });
    if (!capacity) return;
    const data = await fetch(`/api/products?suspensions=true&category=${encodeURIComponent(category)}&series=${encodeURIComponent(series)}&capacity=${encodeURIComponent(capacity)}`).then((r) => r.json());
    // If only one suspension type, auto-select it
    if (data.length === 1) {
      patchRow(index, { suspensions: data, loading: null });
      onSuspensionChange(index, data[0], { category, series, capacity });
    } else {
      patchRow(index, { suspensions: data, loading: null });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, patchRow]);

  const onSuspensionChange = useCallback(async (
    index: number, suspension: string,
    overrides?: { category: string; series: string; capacity: string }
  ) => {
    setValue(`products.${index}.productId`, "");
    const row = rowStatesRef.current[index];
    const cat = overrides?.category ?? row.category;
    const ser = overrides?.series ?? row.series;
    const cap = overrides?.capacity ?? row.capacity;
    patchRow(index, { suspension, trolleyRange: "", lift: "", trolleyRanges: [], lifts: [], resolved: null, loading: suspension ? "trolleyRanges" : null });
    if (!suspension) return;

    if (isTrolleyType(suspension)) {
      const data = await fetch(`/api/products?trolleyRanges=true&category=${encodeURIComponent(cat)}&series=${encodeURIComponent(ser)}&capacity=${encodeURIComponent(cap)}&suspension=${encodeURIComponent(suspension)}`).then((r) => r.json());
      const validRanges = data.filter(Boolean);
      if (validRanges.length === 0 || (validRanges.length === 1 && !validRanges[0])) {
        patchRow(index, { trolleyRanges: [], loading: null });
        onTrolleyRangeChange(index, "", { cat, ser, cap, suspension });
      } else if (validRanges.length === 1) {
        patchRow(index, { trolleyRanges: validRanges, loading: null });
        onTrolleyRangeChange(index, validRanges[0], { cat, ser, cap, suspension });
      } else {
        patchRow(index, { trolleyRanges: validRanges, loading: null });
      }
    } else {
      patchRow(index, { trolleyRanges: [], loading: "lifts" });
      const data = await fetch(`/api/products?lifts=true&category=${encodeURIComponent(cat)}&series=${encodeURIComponent(ser)}&capacity=${encodeURIComponent(cap)}&suspension=${encodeURIComponent(suspension)}`).then((r) => r.json());
      patchRow(index, { lifts: data, loading: null });
      if (data.length === 1) onLiftChange(index, String(data[0]), { cat, ser, cap, suspension, trolleyRange: "" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, patchRow]);

  const onTrolleyRangeChange = useCallback(async (
    index: number, trolleyRange: string,
    overrides?: { cat: string; ser: string; cap: string; suspension: string }
  ) => {
    setValue(`products.${index}.productId`, "");
    const row = rowStatesRef.current[index];
    const cat = overrides?.cat ?? row.category;
    const ser = overrides?.ser ?? row.series;
    const cap = overrides?.cap ?? row.capacity;
    const susp = overrides?.suspension ?? row.suspension;
    patchRow(index, { trolleyRange, lift: "", lifts: [], resolved: null, loading: "lifts" });
    const qs = new URLSearchParams({ lifts: "true", category: cat, series: ser, capacity: cap, suspension: susp });
    if (trolleyRange) qs.set("trolleyRange", trolleyRange);
    const data = await fetch(`/api/products?${qs}`).then((r) => r.json());
    patchRow(index, { lifts: data, loading: null });
    if (data.length === 1) onLiftChange(index, String(data[0]), { cat, ser, cap, suspension: susp, trolleyRange });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, patchRow]);

  const onLiftChange = useCallback(async (
    index: number, lift: string,
    overrides?: { cat: string; ser: string; cap: string; suspension: string; trolleyRange: string }
  ) => {
    setValue(`products.${index}.productId`, "");
    const row = rowStatesRef.current[index];
    const cat = overrides?.cat ?? row.category;
    const ser = overrides?.ser ?? row.series;
    const cap = overrides?.cap ?? row.capacity;
    const susp = overrides?.suspension ?? row.suspension;
    const tr = overrides?.trolleyRange ?? row.trolleyRange;
    patchRow(index, { lift, speedType: "", speedTypes: [], resolved: null, loading: "speedTypes" });

    // Check if speed types are needed
    const speedQs = new URLSearchParams({ speedTypes: "true", category: cat, series: ser, capacity: cap, suspension: susp, lift });
    if (tr) speedQs.set("trolleyRange", tr);
    const speeds: string[] = await fetch(`/api/products?${speedQs}`).then((r) => r.json());

    if (speeds.length > 1) {
      patchRow(index, { speedTypes: speeds, loading: null });
    } else {
      // Auto-select single speed type or none, go straight to resolve
      const speedType = speeds.length === 1 ? speeds[0] : "";
      patchRow(index, { speedTypes: speeds, speedType, loading: "resolving" });
      const qs = new URLSearchParams({ resolve: "true", category: cat, series: ser, capacity: cap, suspension: susp, lift });
      if (tr) qs.set("trolleyRange", tr);
      if (speedType) qs.set("speedType", speedType);
      const data = await fetch(`/api/products?${qs}`).then((r) => r.json());
      if (data?.id) {
        patchRow(index, { resolved: data, loading: null });
        setValue(`products.${index}.productId`, data.id);
      } else {
        patchRow(index, { loading: null });
      }
    }
  }, [setValue, patchRow]);

  const onSpeedTypeChange = useCallback(async (index: number, speedType: string) => {
    setValue(`products.${index}.productId`, "");
    const row = rowStatesRef.current[index];
    patchRow(index, { speedType, resolved: null, loading: "resolving" });
    const qs = new URLSearchParams({ resolve: "true", category: row.category, series: row.series, capacity: row.capacity, suspension: row.suspension, lift: row.lift, speedType });
    if (row.trolleyRange) qs.set("trolleyRange", row.trolleyRange);
    const data = await fetch(`/api/products?${qs}`).then((r) => r.json());
    if (data?.id) {
      patchRow(index, { resolved: data, loading: null });
      setValue(`products.${index}.productId`, data.id);
    } else {
      patchRow(index, { loading: null });
    }
  }, [setValue, patchRow]);

  // ── Row add/remove ──────────────────────────────────────────────────────────

  function handleAddRow() {
    append({ productId: "", quantity: 1 });
    setRowStates((prev) => [...prev, EMPTY_ROW]);
  }

  function handleRemoveRow(index: number) {
    remove(index);
    setRowStates((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

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
      setServerError("Something went wrong. Please try again or email us at elmechin@gmail.com");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success ─────────────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="bg-green-50 border border-green-300 rounded-2xl p-10 text-center max-w-lg mx-auto">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-green-800 mb-2">Quotation Sent!</h2>
        <p className="text-green-700 mb-1">Your quotation has been emailed to you.</p>
        <p className="text-sm text-green-600 font-mono font-medium mb-5">Ref: {success}</p>
        <p className="text-sm text-green-700 mb-6">Our team will follow up shortly.</p>
        <button onClick={() => setSuccess(null)} className="bg-[#1e3a5f] hover:bg-[#152b47] text-white font-bold px-6 py-3 rounded transition-colors text-sm">
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8" aria-label="Quotation enquiry form">

      {/* Contact Details */}
      <fieldset className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <legend className="text-lg font-bold text-[#1e3a5f] mb-6 px-1">Your Details</legend>
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { id: "customerName", label: "Full Name", placeholder: "John Smith", type: "text", autoComplete: "name" },
            { id: "companyName", label: "Company Name", placeholder: "ABC Manufacturing Ltd", type: "text", autoComplete: "organization" },
            { id: "email", label: "Email Address", placeholder: "you@company.com", type: "email", autoComplete: "email" },
            { id: "phone", label: "Phone Number", placeholder: "+91 9XXXXXXXXX", type: "tel", autoComplete: "tel" },
          ].map(({ id, label, placeholder, type, autoComplete }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                id={id} type={type} autoComplete={autoComplete} placeholder={placeholder}
                {...register(id as keyof Omit<FormValues, "products">)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition"
              />
              {errors[id as keyof typeof errors] && (
                <p className="mt-1.5 text-xs text-red-600">
                  {(errors[id as keyof typeof errors] as { message?: string })?.message}
                </p>
              )}
            </div>
          ))}
          <div className="sm:col-span-2">
            <label htmlFor="city" className="block text-sm font-semibold text-slate-700 mb-1.5">
              City / Address <span className="text-red-500">*</span>
            </label>
            <textarea id="city" rows={2} autoComplete="address-level2" placeholder="e.g. Chennai, Tamil Nadu"
              {...register("city")}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition resize-none"
            />
            {errors.city && <p className="mt-1.5 text-xs text-red-600">{errors.city.message}</p>}
          </div>
        </div>
      </fieldset>

      {/* Products */}
      <fieldset className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <legend className="text-lg font-bold text-[#1e3a5f] mb-1 px-1">Products Required</legend>
        <p className="text-sm text-slate-500 mb-6">
          Select each product step by step. Pricing will be included in the emailed quotation.
        </p>

        <div className="space-y-5">
          {fields.map((field, index) => {
            const row = rowStates[index] ?? EMPTY_ROW;
            const showSeries     = !!row.category;
            const showCapacity   = !!row.series;
            const showSuspension = row.capacities.length > 0 && !!row.capacity;
            const showTrolley    = showSuspension && !!row.suspension && isTrolleyType(row.suspension) && row.trolleyRanges.length > 1;
            const showLift       = row.lifts.length > 1 && (
              !isTrolleyType(row.suspension) ? !!row.suspension : (!!row.trolleyRange || row.trolleyRanges.length === 0)
            );
            const showSpeedType  = row.speedTypes.length > 1 && !!row.lift;

            return (
              <div key={field.id} className="border border-slate-200 rounded-xl overflow-hidden">
                {/* Row header */}
                <div className="flex items-center justify-between bg-slate-50 border-b border-slate-200 px-4 py-2.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Product {index + 1}
                  </span>
                  <button type="button" onClick={() => handleRemoveRow(index)} disabled={fields.length === 1}
                    aria-label={`Remove product ${index + 1}`}
                    className="w-7 h-7 flex items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition disabled:opacity-25 disabled:cursor-not-allowed"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  {/* Level 1: Category + Series side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SelectField
                      label="Category"
                      value={row.category}
                      onChange={(v) => onCategoryChange(index, v)}
                      options={categories}
                      disabled={catLoading}
                      loading={catLoading}
                      placeholder="— Select Category —"
                    />
                    {showSeries && (
                      <SelectField
                        label="Series / Model"
                        value={row.series}
                        onChange={(v) => onSeriesChange(index, v)}
                        options={row.seriesList}
                        disabled={!row.category}
                        loading={row.loading === "series"}
                        placeholder="— Select Series —"
                      />
                    )}
                  </div>

                  {/* Level 2: Capacity + Suspension */}
                  {showCapacity && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <SelectField
                        label="Capacity"
                        value={row.capacity}
                        onChange={(v) => onCapacityChange(index, v)}
                        options={row.capacities}
                        disabled={!row.series}
                        loading={row.loading === "capacities"}
                        placeholder="— Select Capacity —"
                        formatOption={(v) => v !== null ? `${v}T` : "—"}
                      />
                      {showSuspension && (
                        <SelectField
                          label="Suspension / Mounting"
                          value={row.suspension}
                          onChange={(v) => onSuspensionChange(index, v)}
                          options={row.suspensions}
                          disabled={!row.capacity}
                          loading={row.loading === "suspensions"}
                          placeholder="— Select Suspension —"
                        />
                      )}
                    </div>
                  )}

                  {/* Level 3: Trolley Range + Lift Height */}
                  {(showTrolley || showLift) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {showTrolley && (
                        <SelectField
                          label="Trolley Range"
                          value={row.trolleyRange}
                          onChange={(v) => onTrolleyRangeChange(index, v)}
                          options={row.trolleyRanges}
                          disabled={!row.suspension}
                          loading={row.loading === "trolleyRanges"}
                          placeholder="— Select Trolley Range —"
                        />
                      )}
                      {showLift && (
                        <SelectField
                          label="Lift Height"
                          value={row.lift}
                          onChange={(v) => onLiftChange(index, v)}
                          options={row.lifts}
                          disabled={false}
                          loading={row.loading === "lifts"}
                          placeholder="— Select Lift Height —"
                          formatOption={(v) => v !== null ? `${v} m` : "—"}
                        />
                      )}
                    </div>
                  )}

                  {/* Level 4: Speed Type (HC series) */}
                  {showSpeedType && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <SelectField
                        label="Speed Type"
                        value={row.speedType}
                        onChange={(v) => onSpeedTypeChange(index, v)}
                        options={row.speedTypes}
                        disabled={!row.lift}
                        loading={row.loading === "speedTypes"}
                        placeholder="— Select Speed Type —"
                      />
                    </div>
                  )}

                  {/* Resolved product + Qty */}
                  {row.loading === "resolving" && (
                    <div className="flex items-center gap-2 text-sm text-slate-400 py-1">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Looking up product…
                    </div>
                  )}

                  {row.resolved && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1e3a5f] leading-snug">{row.resolved.product_name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {[
                            row.resolved.capacity_tonnes && `${row.resolved.capacity_tonnes}T`,
                            row.resolved.suspension_type,
                            row.resolved.trolley_range,
                            row.resolved.lift_height_metres && `${row.resolved.lift_height_metres}m lift`,
                            row.resolved.indef_code && `[${row.resolved.indef_code}]`,
                          ].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Qty</label>
                        <input
                          type="number" min="1" defaultValue={1}
                          {...register(`products.${index}.quantity`, { valueAsNumber: true })}
                          className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] transition"
                          aria-label={`Quantity for product ${index + 1}`}
                        />
                      </div>
                    </div>
                  )}

                  {errors.products?.[index]?.productId && (
                    <p className="text-xs text-red-600">{errors.products[index]?.productId?.message}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button type="button" onClick={handleAddRow}
          className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#1e3a5f] hover:text-amber-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Another Product
        </button>
      </fieldset>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
        <strong>Note:</strong> Pricing will be included in the quotation emailed to you.
        Final pricing is subject to confirmation by our team.
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-xl px-5 py-4">{serverError}</div>
      )}

      <button type="submit" disabled={submitting}
        className="w-full bg-[#1e3a5f] hover:bg-[#152b47] disabled:bg-slate-400 text-white font-bold text-base px-8 py-4 rounded-xl transition-colors flex items-center justify-center gap-3"
      >
        {submitting ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Sending Quotation…
          </>
        ) : "Request Quotation →"}
      </button>
    </form>
  );
}

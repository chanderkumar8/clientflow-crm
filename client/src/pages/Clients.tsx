
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  RefreshCw,
  Users,
  X,
} from "lucide-react";

import {
  createCustomer,
  getCustomers,
  type Customer,
  type CustomerStatus,
  type CreateCustomerData,
} from "../services/customerService";

const emptyForm: CreateCustomerData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "lead",
  notes: "",
};

const statusStyles: Record<CustomerStatus, string> = {
  lead: "bg-amber-50 text-amber-700",
  active: "bg-emerald-50 text-emerald-700",
  inactive: "bg-slate-100 text-slate-600",
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Cannot connect to the CRM API. Check that the backend and MongoDB are running.";
    }

    return (
      error.response.data?.message ||
      "Unable to complete your request."
    );
  }

  return "Something went wrong. Please try again.";
}

export default function Clients() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | CustomerStatus>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<CreateCustomerData>(emptyForm);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const records = await getCustomers();
      setCustomers(records);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesStatus =
        statusFilter === "all" ||
        customer.status === statusFilter;

      const searchableText = [
        customer.name,
        customer.email,
        customer.company,
        customer.phone,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(query);
    });
  }, [customers, search, statusFilter]);

  function updateForm<K extends keyof CreateCustomerData>(
    key: K,
    value: CreateCustomerData[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function openModal() {
    setForm({ ...emptyForm });
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (!saving) {
      setModalOpen(false);
      setFormError("");
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Customer name is required.");
      return;
    }

    setSaving(true);

    try {
      const customer = await createCustomer({
        name: form.name.trim(),
        email: form.email?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        company: form.company?.trim() || undefined,
        status: form.status,
        notes: form.notes?.trim() || undefined,
      });

      setCustomers((current) => [customer, ...current]);
      setModalOpen(false);
      setForm({ ...emptyForm });
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-5 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Clients
          </h1>
          <p className="mt-1 text-slate-500">
            Manage your customer relationships in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={openModal}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          Add Client
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Clients" value={customers.length} />
        <StatCard
          label="Active Clients"
          value={customers.filter((c) => c.status === "active").length}
        />
        <StatCard
          label="New Leads"
          value={customers.filter((c) => c.status === "lead").length}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-5">
          <div className="relative min-w-48 flex-1">
            <Search
              size={18}
              className="absolute left-4 top-3 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, company or email..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as "all" | CustomerStatus
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700"
          >
            <option value="all">All statuses</option>
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            type="button"
            onClick={() => void loadCustomers()}
            disabled={loading}
            aria-label="Refresh clients"
            className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date Added</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer._id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">
                      {customer.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {customer.email || "No email"}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {customer.company || "—"}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {customer.phone || "—"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[customer.status]}`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && !error && filteredCustomers.length === 0 && (
            <div className="flex flex-col items-center p-14 text-center">
              <Users size={38} className="text-slate-300" />
              <h3 className="mt-4 font-semibold text-slate-800">
                No clients found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Add your first client or adjust your filters.
              </p>
            </div>
          )}

          {loading && (
            <p className="p-10 text-center text-sm text-slate-500">
              Loading clients...
            </p>
          )}
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-client-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="add-client-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Add New Client
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter your client's information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label htmlFor="client-name" className="mb-2 block text-sm font-medium">
                  Full name *
                </label>
                <input
                  id="client-name"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  className={inputClass}
                  placeholder="Client name"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="client-email" className="mb-2 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="client-email"
                    type="email"
                    maxLength={254}
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    className={inputClass}
                    placeholder="client@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="client-phone" className="mb-2 block text-sm font-medium">
                    Phone
                  </label>
                  <input
                    id="client-phone"
                    maxLength={30}
                    value={form.phone}
                    onChange={(e) => updateForm("phone", e.target.value)}
                    className={inputClass}
                    placeholder="+60..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="client-company" className="mb-2 block text-sm font-medium">
                  Company
                </label>
                <input
                  id="client-company"
                  maxLength={120}
                  value={form.company}
                  onChange={(e) => updateForm("company", e.target.value)}
                  className={inputClass}
                  placeholder="Company name"
                />
              </div>

              <div>
                <label htmlFor="client-status" className="mb-2 block text-sm font-medium">
                  Status
                </label>
                <select
                  id="client-status"
                  value={form.status}
                  onChange={(e) =>
                    updateForm("status", e.target.value as CustomerStatus)
                  }
                  className={inputClass}
                >
                  <option value="lead">Lead</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label htmlFor="client-notes" className="mb-2 block text-sm font-medium">
                  Notes
                </label>
                <textarea
                  id="client-notes"
                  rows={3}
                  maxLength={2000}
                  value={form.notes}
                  onChange={(e) => updateForm("notes", e.target.value)}
                  className={inputClass}
                  placeholder="Additional information..."
                />
              </div>

              {formError && (
                <p role="alert" className="text-sm text-red-600">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

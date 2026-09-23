"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ChevronRight,
  Home,
  Briefcase,
  Building,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { lookupPincode } from "@/lib/pincodes";

interface AddressItem {
  id: string;
  name: string;
  phone: string;
  house: string;
  street: string;
  landmark: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  type: "Home" | "Office" | "Other";
  isDefault: boolean;
}

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<AddressItem[]>([
    {
      id: "addr-1",
      name: "Rahul Sharma",
      phone: "+91 98300 12345",
      house: "Flat 4B, Silver Oak Heights",
      street: "Hastings Road",
      landmark: "Near Diamond Plaza",
      area: "Hastings",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700023",
      type: "Home",
      isDefault: true,
    },
    {
      id: "addr-2",
      name: "Rahul Sharma (Work)",
      phone: "+91 98300 12345",
      house: "Cyber Hub Tower C, Level 4",
      street: "Bandra Kurla Complex",
      landmark: "Opposite ICICI Regional HQ",
      area: "Bandra East",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400051",
      type: "Office",
      isDefault: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingAddr, setEditingAddr] = useState<AddressItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    house: "",
    street: "",
    landmark: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    type: "Home" as "Home" | "Office" | "Other",
  });
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingAddr(null);
    setFormData({
      name: "Rahul Sharma",
      phone: "+91 98300 12345",
      house: "",
      street: "",
      landmark: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      type: "Home",
    });
    setPincodeError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (addr: AddressItem) => {
    setEditingAddr(addr);
    setFormData({
      name: addr.name,
      phone: addr.phone,
      house: addr.house,
      street: addr.street,
      landmark: addr.landmark,
      area: addr.area,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      type: addr.type,
    });
    setPincodeError(null);
    setShowModal(true);
  };

  const handlePincodeChange = (pin: string) => {
    setFormData((prev) => ({ ...prev, pincode: pin }));
    if (pin.length === 6) {
      const info = lookupPincode(pin);
      if (info.isServiceable) {
        setFormData((prev) => ({
          ...prev,
          city: info.city,
          state: info.state,
          area: info.area || prev.area,
        }));
        setPincodeError(null);
      } else {
        setPincodeError("PIN code not recognized or unserviceable in test network.");
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.pincode.length !== 6) {
      setPincodeError("Please enter a valid 6-digit Indian PIN code");
      return;
    }

    if (editingAddr) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingAddr.id ? { ...a, ...formData } : a))
      );
    } else {
      const newAddr: AddressItem = {
        id: `addr-${Date.now()}`,
        ...formData,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, newAddr]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/account" className="hover:text-fancy-blue">My Account</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">Saved Addresses</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">Delivery Address Book</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage multiple Indian addresses for seamless 1-click checkout and GST invoice matching.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-fancy-blue hover:bg-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white dark:bg-slate-800 rounded-3xl p-5 border-2 shadow-subtle flex flex-col justify-between space-y-4 transition ${
              addr.isDefault ? "border-fancy-blue" : "border-slate-200 dark:border-slate-700"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                    addr.isDefault
                      ? "bg-blue-100 text-fancy-blue dark:bg-blue-950 dark:text-blue-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {addr.type === "Home" && <Home className="w-3 h-3 mr-1" />}
                  {addr.type === "Office" && <Briefcase className="w-3 h-3 mr-1" />}
                  {addr.type === "Other" && <Building className="w-3 h-3 mr-1" />}
                  <span>{addr.type} {addr.isDefault ? "• Default Address" : ""}</span>
                </span>

                {addr.isDefault && (
                  <CheckCircle2 className="w-5 h-5 text-fancy-blue" />
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{addr.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{addr.house}, {addr.street}</p>
                {addr.landmark && <p className="text-[11px] text-slate-400">Landmark: {addr.landmark}</p>}
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {addr.area ? `${addr.area}, ` : ""}{addr.city}, {addr.state} - <strong className="font-mono">{addr.pincode}</strong>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Mobile: <strong>{addr.phone}</strong></p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleOpenEdit(addr)}
                  className="font-bold text-fancy-blue hover:underline flex items-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                {!addr.isDefault && (
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="font-bold text-red-500 hover:underline flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>

              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Set as Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                {editingAddr ? "Edit Delivery Address" : "Add New Indian Address"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(["Home", "Office", "Other"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: t })}
                    className={`py-2 rounded-xl border text-center font-bold transition ${
                      formData.type === t
                        ? "border-fancy-blue bg-blue-50 dark:bg-blue-950 text-fancy-blue"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">6-Digit PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 700023"
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">City / District *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>
              </div>

              {pincodeError && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-[11px] flex items-center space-x-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{pincodeError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Flat, House No., Building Name *</label>
                <input
                  type="text"
                  required
                  value={formData.house}
                  onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Street Address, Colony, Sector *</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-fancy-blue hover:bg-blue-600 text-white font-bold shadow"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

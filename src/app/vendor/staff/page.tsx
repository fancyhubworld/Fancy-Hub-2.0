"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Users,
  Plus,
  ShieldCheck,
  Check,
  X,
  UserPlus,
  Mail,
  MoreVertical,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { VendorShell } from "@/components/vendor/VendorShell";

type StaffRole =
  | "OWNER"
  | "MANAGER"
  | "PRODUCT_MANAGER"
  | "ORDER_MANAGER"
  | "SUPPORT_STAFF"
  | "MARKETING_STAFF";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: "ACTIVE" | "INVITED" | "SUSPENDED";
  joinedDate: string;
}

export default function VendorStaffPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: "st-1",
      name: "Rahul Sharma",
      email: "rahul@suratsilkmills.in",
      role: "OWNER",
      status: "ACTIVE",
      joinedDate: "12 Jan 2025",
    },
    {
      id: "st-2",
      name: "Meera Joshi",
      email: "meera.ops@suratsilkmills.in",
      role: "MANAGER",
      status: "ACTIVE",
      joinedDate: "04 Mar 2025",
    },
    {
      id: "st-3",
      name: "Sunil Verma",
      email: "sunil.catalog@suratsilkmills.in",
      role: "PRODUCT_MANAGER",
      status: "ACTIVE",
      joinedDate: "18 Jun 2025",
    },
    {
      id: "st-4",
      name: "Karan Dave",
      email: "karan.dispatch@suratsilkmills.in",
      role: "ORDER_MANAGER",
      status: "ACTIVE",
      joinedDate: "02 Sep 2025",
    },
    {
      id: "st-5",
      name: "Pooja Trivedi",
      email: "pooja.support@suratsilkmills.in",
      role: "SUPPORT_STAFF",
      status: "INVITED",
      joinedDate: "Pending Invite",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<StaffRole>("ORDER_MANAGER");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newMember: StaffMember = {
      id: `st-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      status: "INVITED",
      joinedDate: "Today",
    };

    setStaffList([...staffList, newMember]);
    setShowAddModal(false);
    setNewName("");
    setNewEmail("");
    showToast(`Invitation sent to ${newEmail}!`);
  };

  const handleDeleteStaff = (id: string) => {
    setStaffList(staffList.filter((s) => s.id !== id));
    showToast("Staff member removed.");
  };

  // Permission Matrix Definition
  const permissions = [
    { name: "View Dashboard & Metrics", owner: true, manager: true, prod: true, ord: true, sup: false, mkt: true },
    { name: "Add / Edit / Delete Products", owner: true, manager: true, prod: true, ord: false, sup: false, mkt: false },
    { name: "Manage Live Stock & Pricing", owner: true, manager: true, prod: true, ord: false, sup: false, mkt: false },
    { name: "Process & Dispatch Orders", owner: true, manager: true, prod: false, ord: true, sup: false, mkt: false },
    { name: "Print Shipping Labels / Manifests", owner: true, manager: true, prod: false, ord: true, sup: false, mkt: false },
    { name: "Customer Reviews & Support Chat", owner: true, manager: true, prod: false, ord: false, sup: true, mkt: false },
    { name: "Create Coupons & Store Banners", owner: true, manager: true, prod: false, ord: false, sup: false, mkt: true },
    { name: "Financial Ledger & Withdrawals", owner: true, manager: false, prod: false, ord: false, sup: false, mkt: false },
    { name: "Staff Member Management", owner: true, manager: false, prod: false, ord: false, sup: false, mkt: false },
  ];

  return (
    <VendorShell>
      <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                Store Staff & Role Permissions
              </h1>
              <span className="bg-blue-100 text-fancy-blue text-[10px] font-bold px-2 py-0.5 rounded-full">
                {staffList.length} Team Members
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Grant granular access to managers, catalog designers, order dispatchers, and support staff.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 bg-fancy-blue hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
        </div>

        {/* Staff Members List */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4">
          <h3 className="font-black text-slate-900 dark:text-white text-base">Active Store Team Roster</h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {staffList.map((member) => (
              <div key={member.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-fancy-blue font-black flex items-center justify-center text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-black text-slate-900 dark:text-white block">{member.name}</span>
                    <span className="text-slate-400 text-[11px]">{member.email}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                      member.role === "OWNER"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
                        : member.role === "MANAGER"
                        ? "bg-blue-100 text-fancy-blue dark:bg-blue-900/40 dark:text-blue-300"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {member.role.replace("_", " ")}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      member.status === "ACTIVE"
                        ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                        : "text-amber-600 bg-amber-50 dark:bg-amber-950/40"
                    }`}
                  >
                    {member.status}
                  </span>

                  {member.role !== "OWNER" && (
                    <button
                      onClick={() => handleDeleteStaff(member.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complete 6-Role Permission Matrix */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">Store Role Permission Matrix</h3>
              <p className="text-xs text-slate-500">Security & RBAC boundaries across all 6 vendor roles</p>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Immutable Ledger Isolation Active</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-black uppercase text-[10px]">
                  <th className="pb-3 px-3">Permission Capability</th>
                  <th className="pb-3 px-2 text-center">Owner</th>
                  <th className="pb-3 px-2 text-center">Manager</th>
                  <th className="pb-3 px-2 text-center">Product Mgr</th>
                  <th className="pb-3 px-2 text-center">Order Mgr</th>
                  <th className="pb-3 px-2 text-center">Support</th>
                  <th className="pb-3 px-2 text-center">Marketing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-semibold text-slate-700 dark:text-slate-300">
                {permissions.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                    <td className="py-3 px-3">{p.name}</td>
                    <td className="py-3 px-2 text-center">
                      {p.owner ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {p.manager ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {p.prod ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {p.ord ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {p.sup ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {p.mkt ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Staff Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-black text-slate-900 dark:text-white text-base">Invite Store Staff Member</h3>

              <form onSubmit={handleAddStaff} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Amit Verma"
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Staff Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="amit@example.com"
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Assign Role *</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as StaffRole)}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold dark:text-white outline-none focus:border-fancy-blue"
                  >
                    <option value="MANAGER" className="dark:bg-slate-800">Manager (Full Ops except Finances)</option>
                    <option value="PRODUCT_MANAGER" className="dark:bg-slate-800">Product Manager (Catalog & Pricing)</option>
                    <option value="ORDER_MANAGER" className="dark:bg-slate-800">Order Manager (Fulfillment & Shipping)</option>
                    <option value="SUPPORT_STAFF" className="dark:bg-slate-800">Support Staff (Reviews & Customer Chat)</option>
                    <option value="MARKETING_STAFF" className="dark:bg-slate-800">Marketing Staff (Coupons & Banners)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-fancy-blue hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Send Access Invitation
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </VendorShell>
  );
}

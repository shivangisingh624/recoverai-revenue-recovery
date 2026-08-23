import React, { useState } from 'react';
import { Customer } from '../../types';
import { formatINR } from '../../utils/currency';
import { Users, Eye, UserPlus, Trash2, Loader2 } from 'lucide-react';
import { AddCustomerModal } from './AddCustomerModal';
import { deleteCustomer } from '../../services/api';

interface CustomerListProps {
  customers: Customer[];
  onSelectCustomer: (id: string) => void;
  onRefresh: () => void;
  onOpenAddCustomer?: () => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  onSelectCustomer,
  onRefresh,
  onOpenAddCustomer,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to remove customer "${name}"?`)) return;

    setDeletingId(id);
    try {
      await deleteCustomer(id);
      onRefresh();
    } catch (err) {
      console.error('Error deleting customer:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenAddCustomer) {
      onOpenAddCustomer();
    } else {
      setIsAddModalOpen(true);
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-400" /> Customer 360 Profiles
          </h3>
          <p className="text-xs text-slate-400">Merchant Customer Directory & Lifetime Value Metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
            {customers.length} Customers
          </span>
          <button
            type="button"
            onClick={handleOpenModal}
            className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition flex items-center space-x-1.5 cursor-pointer relative z-10"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Lifetime Value</th>
              <th className="py-3.5 px-4">Successful</th>
              <th className="py-3.5 px-4">Failed</th>
              <th className="py-3.5 px-4">Avg Transaction</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
            {customers.map((c) => (
              <tr
                key={c.id}
                onClick={() => onSelectCustomer(c.id)}
                className="hover:bg-slate-800/40 cursor-pointer transition"
              >
                <td className="py-3.5 px-4">
                  <div className="font-bold text-white flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-600/30 text-brand-400 flex items-center justify-center text-xs font-extrabold">
                      {c.name[0]}
                    </div>
                    {c.name}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono ml-9">{c.email}</div>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                  {formatINR(c.cltvPaise)}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                  {c.successfulPayments}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                  {c.failedPayments}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-300">
                  {formatINR(c.avgTransactionPaise)}
                </td>
                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => onSelectCustomer(c.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-brand-600 text-slate-200 hover:text-white font-bold text-xs transition flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> 360
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === c.id}
                      onClick={(e) => handleDelete(c.id, c.name, e)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 font-bold transition"
                      title="Remove Customer"
                    >
                      {deletingId === c.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
};

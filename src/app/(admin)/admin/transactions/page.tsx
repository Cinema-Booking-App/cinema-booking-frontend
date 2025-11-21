"use client"
import React, { useState } from 'react';
import { useGetVnPayHistoryQuery } from '@/store/slices/payments/paymentsApi';

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const { data, isLoading, error } = useGetVnPayHistoryQuery({ page, limit });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quản lý giao dịch</h1>
            <p className="text-foreground">Lịch sử giao dịch VNPay</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">VNPay Txn No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Pay Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">User ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && (
                <tr><td colSpan={6} className="p-6 text-center">Loading...</td></tr>
              )}
              {error && (
                <tr><td colSpan={6} className="p-6 text-center text-red-600">Error loading data</td></tr>
              )}
              {!isLoading && !error && items.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center">No transactions</td></tr>
              )}
              {items.map((it: any) => (
                <tr key={it.payment_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.order_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.vnp_transaction_no}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.payment_status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.vnp_pay_date ?? it.created_at}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.user_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">Total: {total}</div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-gray-200 rounded"
              disabled={page === 1}
            >Prev</button>
            <div className="px-3 py-1 border rounded">Page {page}</div>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

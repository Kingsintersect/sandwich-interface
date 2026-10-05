"use client";
import Search from '@/components/ui/inputs/Search';
import React, { useEffect, useMemo, useState } from 'react'
import { Card } from "@/components/ui/card"
import { DataTable } from '@/components/ui/datatable/DataTable';
import { StudentsPaymentTable, type PaymentTableColumnType } from './StudentPaymentsTable';
import { filterData } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { GetStudentPaymentHistory } from '@/app/actions/student';

export type Payment = PaymentTableColumnType;

export const dynamic = "force-dynamic";

const StudentsPaymentPage = () => {
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { access_token, user } = useAuth();

  // The session used to be guessed from the payment date. It is a real column
  // (academic_session), so read it and fall back to the student's own session
  // rather than inventing one.
  const resolveSession = (payment: Record<string, unknown>): string => {
    const fromPayment = payment.academic_session ?? payment.session;
    if (typeof fromPayment === "string" && fromPayment.trim()) return fromPayment;

    const fromStudent = user?.academic_session;
    if (typeof fromStudent === "string" && fromStudent.trim()) return fromStudent;

    return "—";
  };

  const transformPaymentData = (apiData: Record<string, unknown>[]): Payment[] => {
    return (Array.isArray(apiData) ? apiData : []).map(payment => ({
      id: String(payment.id ?? ""),
      status: String(payment.status ?? "").toLowerCase() as Payment["status"],
      session: resolveSession(payment),
      amount: String(payment.amount ?? ""),
      date: String(payment.created_at ?? ""),
      reference: String(payment.reference ?? ""),
    }));
  };

  const fetchPaymentHistory = async (access_token: string) => {
    setLoading(true);
    setError(null);

    try {
      const { success, error } = await GetStudentPaymentHistory(access_token);
      if (success) {
        const transformedData = transformPaymentData(success.data);
        const sortedData = transformedData.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setPaymentHistory(sortedData);
      } else if (error) {
        setError(error.message || "Failed to fetch payment history");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (access_token) {
      fetchPaymentHistory(access_token).catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access_token]);

  const filteredData = useMemo(() => {
    return filterData(
      paymentHistory,
      "status",
      "ALL",
      ["session", "reference", "status"],
      searchQuery
    );
  }, [searchQuery, paymentHistory]);

  return (
    <div className="pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ocean-900 dark:text-foreground">
          Payment history
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every application fee payment on your record, newest first.
        </p>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <Card className="mt-6 rounded-2xl border-border p-5 shadow-soft sm:p-7">
        <div className="mb-7 space-y-6">
          <div className="max-w-md">
            <Search
              name={'search'}
              placeholder='Search by session or reference...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-3 rounded w-full"
            />
          </div>

          <DataTable
            columns={StudentsPaymentTable}
            data={filteredData}
            isLoading={loading}
          />
        </div>
      </Card>
    </div>
  )
}

export default StudentsPaymentPage

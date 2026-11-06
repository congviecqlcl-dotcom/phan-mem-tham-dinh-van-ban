import React, { useEffect, useState } from "react";
import { authenticatedFetch } from "../utils/auth";

type AdminUser = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  app_active: boolean | null;
  roles: string[];
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  sync_status: string;
};

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    authenticatedFetch(`/api/admin/users?page=${page}&per_page=50`)
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Không tải được danh sách tài khoản.");
        return payload;
      })
      .then((payload) => { if (active) setUsers(Array.isArray(payload.users) ? payload.users : []); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Có lỗi xảy ra."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page]);

  const date = (value: string | null) => value ? new Date(value).toLocaleString("vi-VN") : "Chưa có";

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Quản lý tài khoản</h1>
        <p className="mt-1 text-sm text-neutral-600">Danh sách chỉ đọc từ Supabase Auth và hồ sơ ứng dụng. Chức năng thay đổi quyền chưa được mở.</p>
      </div>
      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
      {loading ? <p className="text-sm text-neutral-600">Đang tải danh sách tài khoản...</p> : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Tài khoản</th>
                <th className="px-4 py-3 font-semibold">Tên hiển thị</th>
                <th className="px-4 py-3 font-semibold">Vai trò</th>
                <th className="px-4 py-3 font-semibold">Trạng thái ứng dụng</th>
                <th className="px-4 py-3 font-semibold">Đăng nhập gần nhất</th>
                <th className="px-4 py-3 font-semibold">Đồng bộ dữ liệu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {users.map((user) => (
                <tr key={user.user_id} className="align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{user.email || "Không có email"}</div>
                    <div className="mt-1 max-w-56 break-all text-xs text-neutral-500">{user.user_id}</div>
                    <div className="mt-1 text-xs text-neutral-500">{user.email_confirmed_at ? "Email đã xác nhận" : "Email chưa xác nhận"}</div>
                  </td>
                  <td className="px-4 py-3">{user.display_name || "Chưa cập nhật"}</td>
                  <td className="px-4 py-3">{user.roles.length ? user.roles.join(", ") : "Chưa phân vai trò"}</td>
                  <td className="px-4 py-3">{user.app_active === null ? "Chưa có hồ sơ" : user.app_active ? "Đang hoạt động" : "Đã khóa"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{date(user.last_sign_in_at)}</td>
                  <td className="px-4 py-3">{user.sync_status === "DONG_BO" ? "Đồng bộ" : user.sync_status === "THIEU_HO_SO_UNG_DUNG" ? "Thiếu hồ sơ ứng dụng" : "Thiếu vai trò"}</td>
                </tr>
              ))}
              {!users.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-500">Không có tài khoản trong trang này.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between">
        <button disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm disabled:opacity-40">Trang trước</button>
        <span className="text-sm text-neutral-600">Trang {page}</span>
        <button disabled={users.length < 50 || loading} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-neutral-300 px-3 py-2 text-sm disabled:opacity-40">Trang sau</button>
      </div>
    </section>
  );
};

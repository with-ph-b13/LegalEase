"use client";

interface RoleSelectProps {
  currentRole: string;
  onChange: (role: string) => void;
  disabled?: boolean;
}

export function RoleSelect({ currentRole, onChange, disabled }: RoleSelectProps) {
  return (
    <select 
      className="select select-bordered select-sm w-full max-w-[120px]" 
      value={currentRole}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="user">User</option>
      <option value="lawyer">Lawyer</option>
      <option value="admin">Admin</option>
    </select>
  );
}

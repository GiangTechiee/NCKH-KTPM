import { useCallback, useEffect, useState } from 'react';
import { layDanhSachSinhVien, layDanhSachGiangVien } from '../../core/api/account.service';

const ROLE_STORAGE_KEY = 'nckh_selected_role';
const STUDENT_CODE_STORAGE_KEY = 'nckh_student_code';
const LECTURER_CODE_STORAGE_KEY = 'nckh_lecturer_code';

const ROLES = Object.freeze({
  STUDENT: 'student',
  LECTURER: 'lecturer',
  ADMIN: 'admin',
});

const ROLE_OPTIONS = [
  { id: ROLES.STUDENT, label: 'Sinh viên' },
  { id: ROLES.LECTURER, label: 'Giảng viên' },
  { id: ROLES.ADMIN, label: 'Quản trị viên' },
];

export function useAccountSelector() {
  const [selectedRole, setSelectedRole] = useState(
    () => localStorage.getItem(ROLE_STORAGE_KEY) || ROLES.STUDENT
  );
  const [studentAccounts, setStudentAccounts] = useState([]);
  const [lecturerAccounts, setLecturerAccounts] = useState([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [accountError, setAccountError] = useState('');

  const [selectedStudentCode, setSelectedStudentCode] = useState(
    () => localStorage.getItem(STUDENT_CODE_STORAGE_KEY) || ''
  );
  const [selectedLecturerCode, setSelectedLecturerCode] = useState(
    () => localStorage.getItem(LECTURER_CODE_STORAGE_KEY) || ''
  );

  useEffect(() => {
    localStorage.setItem(ROLE_STORAGE_KEY, selectedRole);
  }, [selectedRole]);

  useEffect(() => {
    localStorage.setItem(STUDENT_CODE_STORAGE_KEY, selectedStudentCode);
  }, [selectedStudentCode]);

  useEffect(() => {
    localStorage.setItem(LECTURER_CODE_STORAGE_KEY, selectedLecturerCode);
  }, [selectedLecturerCode]);

  const loadAccounts = useCallback(async () => {
    setIsLoadingAccounts(true);
    setAccountError('');

    try {
      const [students, lecturers] = await Promise.all([
        layDanhSachSinhVien(),
        layDanhSachGiangVien(),
      ]);

      setStudentAccounts(students);
      setLecturerAccounts(lecturers);

      if (!selectedStudentCode && students.length > 0) {
        setSelectedStudentCode(students[0].code);
      }
      if (!selectedLecturerCode && lecturers.length > 0) {
        setSelectedLecturerCode(lecturers[0].code);
      }
    } catch (error) {
      setAccountError('Không tải được danh sách tài khoản.');
    } finally {
      setIsLoadingAccounts(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const selectedStudentAccount = studentAccounts.find((a) => a.code === selectedStudentCode) || null;
  const selectedLecturerAccount = lecturerAccounts.find((a) => a.code === selectedLecturerCode) || null;

  const activeCode = selectedRole === ROLES.LECTURER ? selectedLecturerCode : selectedStudentCode;
  const activeAccount =
    selectedRole === ROLES.LECTURER
      ? selectedLecturerAccount
      : selectedStudentAccount;

  return {
    accountError,
    activeAccount,
    activeCode,
    isLoadingAccounts,
    lecturerAccounts,
    selectedLecturerCode,
    selectedRole,
    selectedStudentCode,
    studentAccounts,
    onLecturerCodeChange: setSelectedLecturerCode,
    onRefreshAccounts: loadAccounts,
    onRoleChange: setSelectedRole,
    onStudentCodeChange: setSelectedStudentCode,
    ROLE_OPTIONS,
    ROLES,
  };
}

-- =========================================================
-- HE QL NCKH SINH VIEN - CORE DB TOI THIEU
-- PostgreSQL
-- =========================================================

-- Neu can xoa nhanh de tao lai
DROP TABLE IF EXISTS research_topics CASCADE;
DROP TABLE IF EXISTS research_group_members CASCADE;
DROP TABLE IF EXISTS research_groups CASCADE;
DROP TABLE IF EXISTS student_area_registrations CASCADE;
DROP TABLE IF EXISTS research_areas CASCADE;
DROP TABLE IF EXISTS lecturers CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- =========================================================
-- 1. BANG SINH VIEN
-- =========================================================
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    student_code VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    class_name VARCHAR(50),
    faculty_name VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE students IS 'Bang luu thong tin sinh vien';
COMMENT ON COLUMN students.student_code IS 'Ma sinh vien';
COMMENT ON COLUMN students.full_name IS 'Ho ten sinh vien';
COMMENT ON COLUMN students.class_name IS 'Ten lop';
COMMENT ON COLUMN students.faculty_name IS 'Ten khoa';

-- =========================================================
-- 2. BANG GIANG VIEN
-- =========================================================
CREATE TABLE lecturers (
    id BIGSERIAL PRIMARY KEY,
    lecturer_code VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department_name VARCHAR(100),
    specialization VARCHAR(255),
    max_group_quota INT NOT NULL DEFAULT 0 CHECK (max_group_quota >= 0),
    current_group_count INT NOT NULL DEFAULT 0 CHECK (current_group_count >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE lecturers IS 'Bang luu thong tin giang vien';
COMMENT ON COLUMN lecturers.lecturer_code IS 'Ma giang vien';
COMMENT ON COLUMN lecturers.specialization IS 'Chuyen mon giang vien';
COMMENT ON COLUMN lecturers.max_group_quota IS 'So nhom toi da duoc huong dan';
COMMENT ON COLUMN lecturers.current_group_count IS 'So nhom dang huong dan';

-- =========================================================
-- 3. BANG MANG NGHIEN CUU
-- =========================================================
CREATE TABLE research_areas (
    id BIGSERIAL PRIMARY KEY,
    area_code VARCHAR(20) NOT NULL UNIQUE,
    area_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    registration_start TIMESTAMP NOT NULL,
    registration_end TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_research_areas_status
        CHECK (status IN ('OPEN', 'CLOSED')),
    CONSTRAINT chk_research_areas_time
        CHECK (registration_end > registration_start)
);

COMMENT ON TABLE research_areas IS 'Bang danh muc mang nghien cuu';
COMMENT ON COLUMN research_areas.area_code IS 'Ma mang nghien cuu';
COMMENT ON COLUMN research_areas.area_name IS 'Ten mang nghien cuu';
COMMENT ON COLUMN research_areas.status IS 'Trang thai mo dang ky mang';

-- =========================================================
-- 4. BANG SINH VIEN DANG KY MANG
-- =========================================================
CREATE TABLE student_area_registrations (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    research_area_id BIGINT NOT NULL,
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'REGISTERED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sar_student
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_sar_research_area
        FOREIGN KEY (research_area_id) REFERENCES research_areas(id) ON DELETE CASCADE,
    CONSTRAINT chk_sar_status
        CHECK (status IN ('REGISTERED', 'CANCELLED'))
);

-- Moi sinh vien chi co 1 dang ky mang dang hoat dong trong phien ban toi gian nay
CREATE UNIQUE INDEX uq_student_area_active
    ON student_area_registrations(student_id)
    WHERE status = 'REGISTERED';

COMMENT ON TABLE student_area_registrations IS 'Bang sinh vien dang ky mang nghien cuu';
COMMENT ON COLUMN student_area_registrations.status IS 'Trang thai dang ky mang';

-- =========================================================
-- 5. BANG NHOM NGHIEN CUU
-- =========================================================
CREATE TABLE research_groups (
    id BIGSERIAL PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL,
    research_area_id BIGINT NOT NULL,
    leader_student_id BIGINT NOT NULL,
    lecturer_id BIGINT,
    status VARCHAR(30) NOT NULL DEFAULT 'FORMING',
    member_count INT NOT NULL DEFAULT 1 CHECK (member_count >= 1 AND member_count <= 3),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rg_area
        FOREIGN KEY (research_area_id) REFERENCES research_areas(id) ON DELETE RESTRICT,
    CONSTRAINT fk_rg_leader
        FOREIGN KEY (leader_student_id) REFERENCES students(id) ON DELETE RESTRICT,
    CONSTRAINT fk_rg_lecturer
        FOREIGN KEY (lecturer_id) REFERENCES lecturers(id) ON DELETE SET NULL,
    CONSTRAINT chk_rg_status
        CHECK (status IN ('FORMING','FULL','WAITING_FOR_LECTURER','HAS_LECTURER','CHOOSING_TOPIC','TOPIC_PENDING','TOPIC_APPROVED','TOPIC_FINALIZED'))
);

COMMENT ON TABLE research_groups IS 'Bang nhom nghien cuu';
COMMENT ON COLUMN research_groups.group_name IS 'Ten nhom nghien cuu';
COMMENT ON COLUMN research_groups.leader_student_id IS 'Sinh vien truong nhom';
COMMENT ON COLUMN research_groups.lecturer_id IS 'Giang vien huong dan nhom';
COMMENT ON COLUMN research_groups.member_count IS 'So luong thanh vien hien tai';

-- Ten nhom khong duoc trung trong cung 1 mang
CREATE UNIQUE INDEX uq_group_name_per_area
    ON research_groups(research_area_id, group_name);

-- =========================================================
-- 6. BANG THANH VIEN NHOM
-- =========================================================
CREATE TABLE research_group_members (
    id BIGSERIAL PRIMARY KEY,
    research_group_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    join_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    joined_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rgm_group
        FOREIGN KEY (research_group_id) REFERENCES research_groups(id) ON DELETE CASCADE,
    CONSTRAINT fk_rgm_student
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT chk_rgm_role
        CHECK (role IN ('LEADER', 'MEMBER')),
    CONSTRAINT chk_rgm_join_status
        CHECK (join_status IN ('PENDING', 'ACCEPTED', 'REJECTED'))
);

-- Mot sinh vien khong duoc xuat hien lap trong cung 1 nhom
CREATE UNIQUE INDEX uq_group_student
    ON research_group_members(research_group_id, student_id);

-- Moi sinh vien chi duoc nam trong 1 nhom dang chap nhan
CREATE UNIQUE INDEX uq_student_one_active_group
    ON research_group_members(student_id)
    WHERE join_status = 'ACCEPTED';

COMMENT ON TABLE research_group_members IS 'Bang thanh vien thuoc nhom nghien cuu';
COMMENT ON COLUMN research_group_members.role IS 'Vai tro trong nhom';
COMMENT ON COLUMN research_group_members.join_status IS 'Trang thai tham gia nhom';

-- =========================================================
-- 7. BANG DE TAI NGHIEN CUU
-- =========================================================
CREATE TABLE research_topics (
    id BIGSERIAL PRIMARY KEY,
    research_group_id BIGINT NOT NULL,
    lecturer_id BIGINT NOT NULL,
    topic_title VARCHAR(255) NOT NULL,
    topic_type VARCHAR(30) NOT NULL,
    problem_description TEXT NOT NULL,
    research_objective TEXT NOT NULL,
    practical_application TEXT,
    scope_description TEXT,
    technologies TEXT,
    reason_for_selection TEXT,
    lecturer_feedback TEXT,
    revision_note TEXT,
    revision_count INT NOT NULL DEFAULT 0 CHECK (revision_count >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    submitted_at TIMESTAMP,
    approved_at TIMESTAMP,
    finalized_at TIMESTAMP,
    revision_deadline TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rt_group
        FOREIGN KEY (research_group_id) REFERENCES research_groups(id) ON DELETE CASCADE,
    CONSTRAINT fk_rt_lecturer
        FOREIGN KEY (lecturer_id) REFERENCES lecturers(id) ON DELETE RESTRICT,
    CONSTRAINT chk_rt_topic_type
        CHECK (topic_type IN ('LECTURER_SUGGESTED', 'GROUP_PROPOSED')),
    CONSTRAINT chk_rt_status
        CHECK (status IN ('DRAFT','PENDING_APPROVAL','NEEDS_REVISION','APPROVED','REJECTED','FINALIZED'))
);

-- Moi nhom toi da co 1 de tai hien hanh trong mo hinh toi gian nay
CREATE UNIQUE INDEX uq_topic_per_group
    ON research_topics(research_group_id);

COMMENT ON TABLE research_topics IS 'Bang de tai nghien cuu cua nhom';
COMMENT ON COLUMN research_topics.topic_type IS 'Loai de tai: giang vien de xuat hoac nhom tu de xuat';
COMMENT ON COLUMN research_topics.status IS 'Trang thai de tai theo vong doi moi';
COMMENT ON COLUMN research_topics.revision_count IS 'So lan chinh sua de tai';

-- =========================================================
-- CAC INDEX PHU DE TOI UU TRUY VAN
-- =========================================================
CREATE INDEX idx_students_student_code ON students(student_code);
CREATE INDEX idx_lecturers_lecturer_code ON lecturers(lecturer_code);
CREATE INDEX idx_research_areas_status ON research_areas(status);
CREATE INDEX idx_research_groups_status ON research_groups(status);
CREATE INDEX idx_research_groups_lecturer_id ON research_groups(lecturer_id);
CREATE INDEX idx_research_group_members_join_status ON research_group_members(join_status);
CREATE INDEX idx_research_topics_status ON research_topics(status);
CREATE INDEX idx_research_topics_lecturer_id ON research_topics(lecturer_id);

-- =========================================================
-- HAM TU DONG CAP NHAT updated_at
-- =========================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- TRIGGER CAP NHAT updated_at CHO CAC BANG
-- =========================================================
CREATE TRIGGER trg_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_lecturers_updated_at
    BEFORE UPDATE ON lecturers
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_research_areas_updated_at
    BEFORE UPDATE ON research_areas
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_student_area_registrations_updated_at
    BEFORE UPDATE ON student_area_registrations
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_research_groups_updated_at
    BEFORE UPDATE ON research_groups
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_research_group_members_updated_at
    BEFORE UPDATE ON research_group_members
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_research_topics_updated_at
    BEFORE UPDATE ON research_topics
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- HE QL NCKH SINH VIEN - CO SO DU LIEU TOI THIEU
-- PostgreSQL
-- Ban dat ten bang va cot bang tieng Viet khong dau
-- =========================================================

-- Neu can xoa nhanh de tao lai
DROP TABLE IF EXISTS de_tai_nghien_cuu CASCADE;
DROP TABLE IF EXISTS thanh_vien_nhom_nghien_cuu CASCADE;
DROP TABLE IF EXISTS nhom_nghien_cuu CASCADE;
DROP TABLE IF EXISTS sinh_vien_dang_ky_mang CASCADE;
DROP TABLE IF EXISTS mang_nghien_cuu CASCADE;
DROP TABLE IF EXISTS giang_vien CASCADE;
DROP TABLE IF EXISTS sinh_vien CASCADE;

-- =========================================================
-- 1. BANG SINH VIEN
-- =========================================================
CREATE TABLE sinh_vien (
    id BIGSERIAL PRIMARY KEY,
    ma_sinh_vien VARCHAR(20) NOT NULL UNIQUE,
    ho_ten VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    ten_lop VARCHAR(50),
    ten_khoa VARCHAR(100),
    so_dien_thoai VARCHAR(20),
    ngay_tao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE sinh_vien IS 'Bang luu thong tin sinh vien';
COMMENT ON COLUMN sinh_vien.ma_sinh_vien IS 'Ma sinh vien';
COMMENT ON COLUMN sinh_vien.ho_ten IS 'Ho ten sinh vien';
COMMENT ON COLUMN sinh_vien.ten_lop IS 'Ten lop';
COMMENT ON COLUMN sinh_vien.ten_khoa IS 'Ten khoa';

-- =========================================================
-- 2. BANG GIANG VIEN
-- =========================================================
CREATE TABLE giang_vien (
    id BIGSERIAL PRIMARY KEY,
    ma_giang_vien VARCHAR(20) NOT NULL UNIQUE,
    ho_ten VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    ten_bo_mon VARCHAR(100),
    chuyen_mon VARCHAR(255),
    so_nhom_huong_dan_toi_da INT NOT NULL DEFAULT 0 CHECK (so_nhom_huong_dan_toi_da >= 0),
    so_nhom_dang_huong_dan INT NOT NULL DEFAULT 0 CHECK (so_nhom_dang_huong_dan >= 0),
    ngay_tao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE giang_vien IS 'Bang luu thong tin giang vien';
COMMENT ON COLUMN giang_vien.ma_giang_vien IS 'Ma giang vien';
COMMENT ON COLUMN giang_vien.chuyen_mon IS 'Chuyen mon giang vien';
COMMENT ON COLUMN giang_vien.so_nhom_huong_dan_toi_da IS 'So nhom toi da duoc huong dan';
COMMENT ON COLUMN giang_vien.so_nhom_dang_huong_dan IS 'So nhom dang huong dan';

-- =========================================================
-- 3. BANG MANG NGHIEN CUU
-- =========================================================
CREATE TABLE mang_nghien_cuu (
    id BIGSERIAL PRIMARY KEY,
    ma_mang VARCHAR(20) NOT NULL UNIQUE,
    ten_mang VARCHAR(100) NOT NULL UNIQUE,
    mo_ta TEXT,
    thoi_gian_mo_dang_ky TIMESTAMP NOT NULL,
    thoi_gian_dong_dang_ky TIMESTAMP NOT NULL,
    trang_thai VARCHAR(20) NOT NULL,
    ngay_tao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_mang_nghien_cuu_trang_thai
        CHECK (trang_thai IN ('OPEN', 'CLOSED')),
    CONSTRAINT chk_mang_nghien_cuu_thoi_gian
        CHECK (thoi_gian_dong_dang_ky > thoi_gian_mo_dang_ky)
);

COMMENT ON TABLE mang_nghien_cuu IS 'Bang danh muc mang nghien cuu';
COMMENT ON COLUMN mang_nghien_cuu.ma_mang IS 'Ma mang nghien cuu';
COMMENT ON COLUMN mang_nghien_cuu.ten_mang IS 'Ten mang nghien cuu';
COMMENT ON COLUMN mang_nghien_cuu.trang_thai IS 'Trang thai mo dang ky mang';

-- =========================================================
-- 4. BANG SINH VIEN DANG KY MANG
-- =========================================================
CREATE TABLE sinh_vien_dang_ky_mang (
    id BIGSERIAL PRIMARY KEY,
    sinh_vien_id BIGINT NOT NULL,
    mang_nghien_cuu_id BIGINT NOT NULL,
    thoi_gian_dang_ky TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'REGISTERED',
    ngay_tao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_svdkm_sinh_vien
        FOREIGN KEY (sinh_vien_id) REFERENCES sinh_vien(id) ON DELETE CASCADE,
    CONSTRAINT fk_svdkm_mang_nghien_cuu
        FOREIGN KEY (mang_nghien_cuu_id) REFERENCES mang_nghien_cuu(id) ON DELETE CASCADE,
    CONSTRAINT chk_svdkm_trang_thai
        CHECK (trang_thai IN ('REGISTERED', 'CANCELLED'))
);

-- Moi sinh vien chi co 1 dang ky mang dang hoat dong trong phien ban toi gian nay
CREATE UNIQUE INDEX uq_sinh_vien_mot_dang_ky_mang_hoat_dong
    ON sinh_vien_dang_ky_mang(sinh_vien_id)
    WHERE trang_thai = 'REGISTERED';

COMMENT ON TABLE sinh_vien_dang_ky_mang IS 'Bang sinh vien dang ky mang nghien cuu';
COMMENT ON COLUMN sinh_vien_dang_ky_mang.trang_thai IS 'Trang thai dang ky mang';

-- =========================================================
-- 5. BANG NHOM NGHIEN CUU
-- =========================================================
CREATE TABLE nhom_nghien_cuu (
    id BIGSERIAL PRIMARY KEY,
    ten_nhom VARCHAR(100) NOT NULL,
    mang_nghien_cuu_id BIGINT NOT NULL,
    truong_nhom_sinh_vien_id BIGINT NOT NULL,
    giang_vien_id BIGINT,
    trang_thai VARCHAR(30) NOT NULL DEFAULT 'FORMING',
    so_luong_thanh_vien INT NOT NULL DEFAULT 1 CHECK (so_luong_thanh_vien >= 1 AND so_luong_thanh_vien <= 3),
    ngay_tao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_nnc_mang
        FOREIGN KEY (mang_nghien_cuu_id) REFERENCES mang_nghien_cuu(id) ON DELETE RESTRICT,
    CONSTRAINT fk_nnc_truong_nhom
        FOREIGN KEY (truong_nhom_sinh_vien_id) REFERENCES sinh_vien(id) ON DELETE RESTRICT,
    CONSTRAINT fk_nnc_giang_vien
        FOREIGN KEY (giang_vien_id) REFERENCES giang_vien(id) ON DELETE SET NULL,
    CONSTRAINT chk_nnc_trang_thai
        CHECK (trang_thai IN ('FORMING','FULL','WAITING_FOR_LECTURER','HAS_LECTURER','CHOOSING_TOPIC','TOPIC_PENDING','TOPIC_APPROVED','TOPIC_FINALIZED'))
);

COMMENT ON TABLE nhom_nghien_cuu IS 'Bang nhom nghien cuu';
COMMENT ON COLUMN nhom_nghien_cuu.ten_nhom IS 'Ten nhom nghien cuu';
COMMENT ON COLUMN nhom_nghien_cuu.truong_nhom_sinh_vien_id IS 'Sinh vien truong nhom';
COMMENT ON COLUMN nhom_nghien_cuu.giang_vien_id IS 'Giang vien huong dan nhom';
COMMENT ON COLUMN nhom_nghien_cuu.so_luong_thanh_vien IS 'So luong thanh vien hien tai';

-- Ten nhom khong duoc trung trong cung 1 mang
CREATE UNIQUE INDEX uq_ten_nhom_trong_mot_mang
    ON nhom_nghien_cuu(mang_nghien_cuu_id, ten_nhom);

-- =========================================================
-- 6. BANG THANH VIEN NHOM NGHIEN CUU
-- =========================================================
CREATE TABLE thanh_vien_nhom_nghien_cuu (
    id BIGSERIAL PRIMARY KEY,
    nhom_nghien_cuu_id BIGINT NOT NULL,
    sinh_vien_id BIGINT NOT NULL,
    vai_tro VARCHAR(20) NOT NULL,
    trang_thai_tham_gia VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    thoi_gian_tham_gia TIMESTAMP,
    ngay_tao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tvnnc_nhom
        FOREIGN KEY (nhom_nghien_cuu_id) REFERENCES nhom_nghien_cuu(id) ON DELETE CASCADE,
    CONSTRAINT fk_tvnnc_sinh_vien
        FOREIGN KEY (sinh_vien_id) REFERENCES sinh_vien(id) ON DELETE CASCADE,
    CONSTRAINT chk_tvnnc_vai_tro
        CHECK (vai_tro IN ('LEADER', 'MEMBER')),
    CONSTRAINT chk_tvnnc_trang_thai_tham_gia
        CHECK (trang_thai_tham_gia IN ('PENDING', 'ACCEPTED', 'REJECTED'))
);

-- Mot sinh vien khong duoc xuat hien lap trong cung 1 nhom
CREATE UNIQUE INDEX uq_nhom_sinh_vien
    ON thanh_vien_nhom_nghien_cuu(nhom_nghien_cuu_id, sinh_vien_id);

-- Moi sinh vien chi duoc nam trong 1 nhom dang chap nhan
CREATE UNIQUE INDEX uq_sinh_vien_mot_nhom_hoat_dong
    ON thanh_vien_nhom_nghien_cuu(sinh_vien_id)
    WHERE trang_thai_tham_gia = 'ACCEPTED';

COMMENT ON TABLE thanh_vien_nhom_nghien_cuu IS 'Bang thanh vien thuoc nhom nghien cuu';
COMMENT ON COLUMN thanh_vien_nhom_nghien_cuu.vai_tro IS 'Vai tro trong nhom';
COMMENT ON COLUMN thanh_vien_nhom_nghien_cuu.trang_thai_tham_gia IS 'Trang thai tham gia nhom';

-- =========================================================
-- 7. BANG DE TAI NGHIEN CUU
-- =========================================================
CREATE TABLE de_tai_nghien_cuu (
    id BIGSERIAL PRIMARY KEY,
    nhom_nghien_cuu_id BIGINT NOT NULL,
    giang_vien_id BIGINT NOT NULL,
    ten_de_tai VARCHAR(255) NOT NULL,
    loai_de_tai VARCHAR(30) NOT NULL,
    mo_ta_van_de TEXT NOT NULL,
    muc_tieu_nghien_cuu TEXT NOT NULL,
    ung_dung_thuc_tien TEXT,
    pham_vi_nghien_cuu TEXT,
    cong_nghe_su_dung TEXT,
    ly_do_lua_chon TEXT,
    nhan_xet_giang_vien TEXT,
    ghi_chu_chinh_sua TEXT,
    so_lan_chinh_sua INT NOT NULL DEFAULT 0 CHECK (so_lan_chinh_sua >= 0),
    trang_thai VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    thoi_gian_nop TIMESTAMP,
    thoi_gian_duyet TIMESTAMP,
    thoi_gian_chot TIMESTAMP,
    han_chinh_sua TIMESTAMP,
    ngay_tao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dtnc_nhom
        FOREIGN KEY (nhom_nghien_cuu_id) REFERENCES nhom_nghien_cuu(id) ON DELETE CASCADE,
    CONSTRAINT fk_dtnc_giang_vien
        FOREIGN KEY (giang_vien_id) REFERENCES giang_vien(id) ON DELETE RESTRICT,
    CONSTRAINT chk_dtnc_loai_de_tai
        CHECK (loai_de_tai IN ('LECTURER_SUGGESTED', 'GROUP_PROPOSED')),
    CONSTRAINT chk_dtnc_trang_thai
        CHECK (trang_thai IN ('DRAFT','PENDING_APPROVAL','NEEDS_REVISION','APPROVED','REJECTED','FINALIZED'))
);

-- Moi nhom toi da co 1 de tai hien hanh trong mo hinh toi gian nay
CREATE UNIQUE INDEX uq_moi_nhom_mot_de_tai
    ON de_tai_nghien_cuu(nhom_nghien_cuu_id);

COMMENT ON TABLE de_tai_nghien_cuu IS 'Bang de tai nghien cuu cua nhom';
COMMENT ON COLUMN de_tai_nghien_cuu.loai_de_tai IS 'Loai de tai: giang vien de xuat hoac nhom tu de xuat';
COMMENT ON COLUMN de_tai_nghien_cuu.trang_thai IS 'Trang thai de tai theo vong doi moi';
COMMENT ON COLUMN de_tai_nghien_cuu.so_lan_chinh_sua IS 'So lan chinh sua de tai';

-- =========================================================
-- CAC INDEX PHU DE TOI UU TRUY VAN
-- =========================================================
CREATE INDEX idx_sinh_vien_ma_sinh_vien ON sinh_vien(ma_sinh_vien);
CREATE INDEX idx_giang_vien_ma_giang_vien ON giang_vien(ma_giang_vien);
CREATE INDEX idx_mang_nghien_cuu_trang_thai ON mang_nghien_cuu(trang_thai);
CREATE INDEX idx_nhom_nghien_cuu_trang_thai ON nhom_nghien_cuu(trang_thai);
CREATE INDEX idx_nhom_nghien_cuu_giang_vien_id ON nhom_nghien_cuu(giang_vien_id);
CREATE INDEX idx_thanh_vien_nhom_trang_thai_tham_gia ON thanh_vien_nhom_nghien_cuu(trang_thai_tham_gia);
CREATE INDEX idx_de_tai_nghien_cuu_trang_thai ON de_tai_nghien_cuu(trang_thai);
CREATE INDEX idx_de_tai_nghien_cuu_giang_vien_id ON de_tai_nghien_cuu(giang_vien_id);

-- =========================================================
-- HAM TU DONG CAP NHAT ngay_cap_nhat
-- =========================================================
CREATE OR REPLACE FUNCTION cap_nhat_ngay_cap_nhat()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ngay_cap_nhat = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- TRIGGER CAP NHAT ngay_cap_nhat CHO CAC BANG
-- =========================================================
CREATE TRIGGER trg_sinh_vien_ngay_cap_nhat
    BEFORE UPDATE ON sinh_vien
    FOR EACH ROW
    EXECUTE FUNCTION cap_nhat_ngay_cap_nhat();

CREATE TRIGGER trg_giang_vien_ngay_cap_nhat
    BEFORE UPDATE ON giang_vien
    FOR EACH ROW
    EXECUTE FUNCTION cap_nhat_ngay_cap_nhat();

CREATE TRIGGER trg_mang_nghien_cuu_ngay_cap_nhat
    BEFORE UPDATE ON mang_nghien_cuu
    FOR EACH ROW
    EXECUTE FUNCTION cap_nhat_ngay_cap_nhat();

CREATE TRIGGER trg_sinh_vien_dang_ky_mang_ngay_cap_nhat
    BEFORE UPDATE ON sinh_vien_dang_ky_mang
    FOR EACH ROW
    EXECUTE FUNCTION cap_nhat_ngay_cap_nhat();

CREATE TRIGGER trg_nhom_nghien_cuu_ngay_cap_nhat
    BEFORE UPDATE ON nhom_nghien_cuu
    FOR EACH ROW
    EXECUTE FUNCTION cap_nhat_ngay_cap_nhat();

CREATE TRIGGER trg_thanh_vien_nhom_ngay_cap_nhat
    BEFORE UPDATE ON thanh_vien_nhom_nghien_cuu
    FOR EACH ROW
    EXECUTE FUNCTION cap_nhat_ngay_cap_nhat();

CREATE TRIGGER trg_de_tai_nghien_cuu_ngay_cap_nhat
    BEFORE UPDATE ON de_tai_nghien_cuu
    FOR EACH ROW
    EXECUTE FUNCTION cap_nhat_ngay_cap_nhat();

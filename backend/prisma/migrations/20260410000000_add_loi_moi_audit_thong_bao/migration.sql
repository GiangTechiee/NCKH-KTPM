-- =========================================================
-- Migration: Them bang loi_moi_nhom, nhat_ky_kiem_toan, thong_bao
-- Va dong bo gia tri trang_thai sang tieng Viet
-- =========================================================

-- Dong bo gia tri trang_thai nhom_nghien_cuu sang tieng Viet
UPDATE nhom_nghien_cuu SET trang_thai = 'NHAP'                  WHERE trang_thai = 'FORMING';
UPDATE nhom_nghien_cuu SET trang_thai = 'DANG_TUYEN_THANH_VIEN' WHERE trang_thai = 'FULL';
UPDATE nhom_nghien_cuu SET trang_thai = 'CHUA_CO_GIANG_VIEN'    WHERE trang_thai = 'WAITING_FOR_LECTURER';
UPDATE nhom_nghien_cuu SET trang_thai = 'DA_CO_GIANG_VIEN'      WHERE trang_thai = 'HAS_LECTURER';
UPDATE nhom_nghien_cuu SET trang_thai = 'DANG_CHON_DE_TAI'      WHERE trang_thai = 'CHOOSING_TOPIC';
UPDATE nhom_nghien_cuu SET trang_thai = 'CHO_DUYET_DE_TAI'      WHERE trang_thai = 'TOPIC_PENDING';
UPDATE nhom_nghien_cuu SET trang_thai = 'DA_DUYET_DE_TAI'       WHERE trang_thai = 'TOPIC_APPROVED';
UPDATE nhom_nghien_cuu SET trang_thai = 'DA_CHOT_DE_TAI'        WHERE trang_thai = 'TOPIC_FINALIZED';

ALTER TABLE nhom_nghien_cuu
    DROP CONSTRAINT IF EXISTS chk_nnc_trang_thai;

ALTER TABLE nhom_nghien_cuu
    ALTER COLUMN trang_thai SET DEFAULT 'NHAP',
    ADD CONSTRAINT chk_nnc_trang_thai
        CHECK (trang_thai IN (
            'NHAP',
            'DANG_TUYEN_THANH_VIEN',
            'DA_DU_THANH_VIEN',
            'CHUA_CO_GIANG_VIEN',
            'DA_CO_GIANG_VIEN',
            'DANG_CHON_DE_TAI',
            'CHO_DUYET_DE_TAI',
            'CAN_CHINH_SUA_DE_TAI',
            'DA_DUYET_DE_TAI',
            'DA_CHOT_DE_TAI'
        ));

-- Dong bo gia tri trang_thai de_tai_nghien_cuu sang tieng Viet
UPDATE de_tai_nghien_cuu SET trang_thai = 'NHAP'                WHERE trang_thai = 'DRAFT';
UPDATE de_tai_nghien_cuu SET trang_thai = 'CHO_GIANG_VIEN_DUYET' WHERE trang_thai = 'PENDING_APPROVAL';
UPDATE de_tai_nghien_cuu SET trang_thai = 'CAN_CHINH_SUA'       WHERE trang_thai = 'NEEDS_REVISION';
UPDATE de_tai_nghien_cuu SET trang_thai = 'DA_DUYET'            WHERE trang_thai = 'APPROVED';
UPDATE de_tai_nghien_cuu SET trang_thai = 'TU_CHOI'             WHERE trang_thai = 'REJECTED';
UPDATE de_tai_nghien_cuu SET trang_thai = 'DA_CHOT'             WHERE trang_thai = 'FINALIZED';

ALTER TABLE de_tai_nghien_cuu
    DROP CONSTRAINT IF EXISTS chk_dtnc_trang_thai;

ALTER TABLE de_tai_nghien_cuu
    ALTER COLUMN trang_thai SET DEFAULT 'NHAP',
    ADD CONSTRAINT chk_dtnc_trang_thai
        CHECK (trang_thai IN (
            'NHAP',
            'CHO_GIANG_VIEN_DUYET',
            'CAN_CHINH_SUA',
            'DA_DUYET',
            'TU_CHOI',
            'DA_CHOT'
        ));

-- Dong bo loai_de_tai sang tieng Viet
UPDATE de_tai_nghien_cuu SET loai_de_tai = 'GIANG_VIEN_DE_XUAT' WHERE loai_de_tai = 'LECTURER_SUGGESTED';
UPDATE de_tai_nghien_cuu SET loai_de_tai = 'NHOM_DE_XUAT'       WHERE loai_de_tai = 'GROUP_PROPOSED';

ALTER TABLE de_tai_nghien_cuu
    DROP CONSTRAINT IF EXISTS chk_dtnc_loai_de_tai;

ALTER TABLE de_tai_nghien_cuu
    ADD CONSTRAINT chk_dtnc_loai_de_tai
        CHECK (loai_de_tai IN ('GIANG_VIEN_DE_XUAT', 'NHOM_DE_XUAT'));

-- Dong bo vai_tro trong thanh_vien_nhom_nghien_cuu sang tieng Viet
UPDATE thanh_vien_nhom_nghien_cuu SET vai_tro = 'TRUONG_NHOM' WHERE vai_tro = 'LEADER';
UPDATE thanh_vien_nhom_nghien_cuu SET vai_tro = 'THANH_VIEN'  WHERE vai_tro = 'MEMBER';

ALTER TABLE thanh_vien_nhom_nghien_cuu
    DROP CONSTRAINT IF EXISTS chk_tvnnc_vai_tro;

ALTER TABLE thanh_vien_nhom_nghien_cuu
    ADD CONSTRAINT chk_tvnnc_vai_tro
        CHECK (vai_tro IN ('TRUONG_NHOM', 'THANH_VIEN'));

-- Dong bo trang_thai_tham_gia sang tieng Viet
UPDATE thanh_vien_nhom_nghien_cuu SET trang_thai_tham_gia = 'CHO_XAC_NHAN' WHERE trang_thai_tham_gia = 'PENDING';
UPDATE thanh_vien_nhom_nghien_cuu SET trang_thai_tham_gia = 'DA_CHAP_NHAN' WHERE trang_thai_tham_gia = 'ACCEPTED';
UPDATE thanh_vien_nhom_nghien_cuu SET trang_thai_tham_gia = 'DA_TU_CHOI'   WHERE trang_thai_tham_gia = 'REJECTED';

ALTER TABLE thanh_vien_nhom_nghien_cuu
    DROP CONSTRAINT IF EXISTS chk_tvnnc_trang_thai_tham_gia;

ALTER TABLE thanh_vien_nhom_nghien_cuu
    ALTER COLUMN trang_thai_tham_gia SET DEFAULT 'CHO_XAC_NHAN',
    ADD CONSTRAINT chk_tvnnc_trang_thai_tham_gia
        CHECK (trang_thai_tham_gia IN ('CHO_XAC_NHAN', 'DA_CHAP_NHAN', 'DA_TU_CHOI'));

-- Cap nhat partial index cho trang_thai_tham_gia moi
DROP INDEX IF EXISTS uq_sinh_vien_mot_nhom_hoat_dong;
CREATE UNIQUE INDEX uq_sinh_vien_mot_nhom_hoat_dong
    ON thanh_vien_nhom_nghien_cuu(sinh_vien_id)
    WHERE trang_thai_tham_gia = 'DA_CHAP_NHAN';

-- =========================================================
-- Them bang loi_moi_nhom (GroupInvitation)
-- =========================================================
CREATE TABLE loi_moi_nhom (
    id BIGSERIAL PRIMARY KEY,
    nhom_nghien_cuu_id BIGINT NOT NULL,
    nguoi_moi_sinh_vien_id BIGINT NOT NULL,
    sinh_vien_duoc_moi_id BIGINT NOT NULL,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'CHO_XAC_NHAN',
    ly_do_tu_choi TEXT,
    thoi_gian_moi TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    thoi_gian_phan_hoi TIMESTAMP,
    ngay_tao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lmn_nhom
        FOREIGN KEY (nhom_nghien_cuu_id) REFERENCES nhom_nghien_cuu(id) ON DELETE CASCADE,
    CONSTRAINT fk_lmn_nguoi_moi
        FOREIGN KEY (nguoi_moi_sinh_vien_id) REFERENCES sinh_vien(id) ON DELETE CASCADE,
    CONSTRAINT fk_lmn_sinh_vien_duoc_moi
        FOREIGN KEY (sinh_vien_duoc_moi_id) REFERENCES sinh_vien(id) ON DELETE CASCADE,
    CONSTRAINT chk_lmn_trang_thai
        CHECK (trang_thai IN ('CHO_XAC_NHAN', 'DA_CHAP_NHAN', 'DA_TU_CHOI', 'DA_HUY')),
    CONSTRAINT chk_lmn_khac_nguoi
        CHECK (nguoi_moi_sinh_vien_id <> sinh_vien_duoc_moi_id)
);

-- Chi co mot loi moi dang cho xu ly giua nhom va sinh vien
CREATE UNIQUE INDEX uq_loi_moi_nhom_dang_cho
    ON loi_moi_nhom(nhom_nghien_cuu_id, sinh_vien_duoc_moi_id)
    WHERE trang_thai = 'CHO_XAC_NHAN';

CREATE INDEX idx_loi_moi_nhom_trang_thai ON loi_moi_nhom(trang_thai);
CREATE INDEX idx_loi_moi_nhom_sinh_vien_duoc_moi ON loi_moi_nhom(sinh_vien_duoc_moi_id);
CREATE INDEX idx_loi_moi_nhom_nhom_id ON loi_moi_nhom(nhom_nghien_cuu_id);

COMMENT ON TABLE loi_moi_nhom IS 'Bang luu loi moi sinh vien vao nhom nghien cuu';
COMMENT ON COLUMN loi_moi_nhom.nguoi_moi_sinh_vien_id IS 'Truong nhom gui loi moi';
COMMENT ON COLUMN loi_moi_nhom.sinh_vien_duoc_moi_id IS 'Sinh vien duoc moi vao nhom';
COMMENT ON COLUMN loi_moi_nhom.trang_thai IS 'Trang thai loi moi: CHO_XAC_NHAN, DA_CHAP_NHAN, DA_TU_CHOI, DA_HUY';
COMMENT ON COLUMN loi_moi_nhom.ly_do_tu_choi IS 'Ly do tu choi neu co';

CREATE TRIGGER trg_loi_moi_nhom_ngay_cap_nhat
    BEFORE UPDATE ON loi_moi_nhom
    FOR EACH ROW
    EXECUTE FUNCTION cap_nhat_ngay_cap_nhat();

-- =========================================================
-- Them bang nhat_ky_kiem_toan (AuditLog)
-- =========================================================
CREATE TABLE nhat_ky_kiem_toan (
    id BIGSERIAL PRIMARY KEY,
    nguoi_thuc_hien_id BIGINT NOT NULL,
    vai_tro_nguoi_thuc_hien VARCHAR(20) NOT NULL,
    hanh_dong VARCHAR(100) NOT NULL,
    loai_doi_tuong VARCHAR(50) NOT NULL,
    doi_tuong_id BIGINT NOT NULL,
    trang_thai_truoc JSONB,
    trang_thai_sau JSONB,
    du_lieu_bo_sung JSONB,
    ngay_tao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_nkkt_vai_tro
        CHECK (vai_tro_nguoi_thuc_hien IN ('SINH_VIEN', 'GIANG_VIEN', 'QUAN_TRI_VIEN'))
);

CREATE INDEX idx_nhat_ky_kiem_toan_nguoi_thuc_hien ON nhat_ky_kiem_toan(nguoi_thuc_hien_id);
CREATE INDEX idx_nhat_ky_kiem_toan_doi_tuong ON nhat_ky_kiem_toan(loai_doi_tuong, doi_tuong_id);
CREATE INDEX idx_nhat_ky_kiem_toan_hanh_dong ON nhat_ky_kiem_toan(hanh_dong);
CREATE INDEX idx_nhat_ky_kiem_toan_ngay_tao ON nhat_ky_kiem_toan(ngay_tao DESC);

COMMENT ON TABLE nhat_ky_kiem_toan IS 'Bang ghi nhat ky kiem toan cac hanh dong quan trong';
COMMENT ON COLUMN nhat_ky_kiem_toan.nguoi_thuc_hien_id IS 'ID nguoi thuc hien hanh dong';
COMMENT ON COLUMN nhat_ky_kiem_toan.vai_tro_nguoi_thuc_hien IS 'Vai tro: SINH_VIEN, GIANG_VIEN, QUAN_TRI_VIEN';
COMMENT ON COLUMN nhat_ky_kiem_toan.hanh_dong IS 'Ten hanh dong: DANG_KY_MANG, TAO_NHOM, CHAP_NHAN_LOI_MOI...';
COMMENT ON COLUMN nhat_ky_kiem_toan.loai_doi_tuong IS 'Loai doi tuong bi tac dong: NhomNghienCuu, DeTaiNghienCuu...';
COMMENT ON COLUMN nhat_ky_kiem_toan.doi_tuong_id IS 'ID cua doi tuong bi tac dong';
COMMENT ON COLUMN nhat_ky_kiem_toan.trang_thai_truoc IS 'Trang thai truoc khi thay doi (JSON)';
COMMENT ON COLUMN nhat_ky_kiem_toan.trang_thai_sau IS 'Trang thai sau khi thay doi (JSON)';
COMMENT ON COLUMN nhat_ky_kiem_toan.du_lieu_bo_sung IS 'Du lieu bo sung tuy ngu canh (JSON)';

-- =========================================================
-- Them bang thong_bao (Notification)
-- =========================================================
CREATE TABLE thong_bao (
    id BIGSERIAL PRIMARY KEY,
    nguoi_nhan_id BIGINT NOT NULL,
    loai_nguoi_nhan VARCHAR(20) NOT NULL,
    tieu_de VARCHAR(255) NOT NULL,
    noi_dung TEXT NOT NULL,
    loai_thong_bao VARCHAR(50) NOT NULL,
    loai_doi_tuong VARCHAR(50),
    doi_tuong_id BIGINT,
    da_doc BOOLEAN NOT NULL DEFAULT FALSE,
    thoi_gian_doc TIMESTAMP,
    ngay_tao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_tb_loai_nguoi_nhan
        CHECK (loai_nguoi_nhan IN ('SINH_VIEN', 'GIANG_VIEN', 'QUAN_TRI_VIEN'))
);

CREATE INDEX idx_thong_bao_nguoi_nhan ON thong_bao(nguoi_nhan_id, loai_nguoi_nhan);
CREATE INDEX idx_thong_bao_chua_doc ON thong_bao(nguoi_nhan_id) WHERE da_doc = FALSE;
CREATE INDEX idx_thong_bao_ngay_tao ON thong_bao(ngay_tao DESC);
CREATE INDEX idx_thong_bao_loai ON thong_bao(loai_thong_bao);

COMMENT ON TABLE thong_bao IS 'Bang luu thong bao gui den nguoi dung';
COMMENT ON COLUMN thong_bao.nguoi_nhan_id IS 'ID nguoi nhan thong bao';
COMMENT ON COLUMN thong_bao.loai_nguoi_nhan IS 'Loai nguoi nhan: SINH_VIEN, GIANG_VIEN, QUAN_TRI_VIEN';
COMMENT ON COLUMN thong_bao.loai_thong_bao IS 'Loai thong bao: DANG_KY_MANG, LOI_MOI_NHOM, DUYET_DE_TAI...';
COMMENT ON COLUMN thong_bao.loai_doi_tuong IS 'Loai doi tuong lien quan (neu co)';
COMMENT ON COLUMN thong_bao.doi_tuong_id IS 'ID doi tuong lien quan (neu co)';
COMMENT ON COLUMN thong_bao.da_doc IS 'Da doc hay chua';

CREATE TRIGGER trg_thong_bao_ngay_cap_nhat
    BEFORE UPDATE ON thong_bao
    FOR EACH ROW
    EXECUTE FUNCTION cap_nhat_ngay_cap_nhat();

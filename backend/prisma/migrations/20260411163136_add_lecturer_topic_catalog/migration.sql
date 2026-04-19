-- DropForeignKey
ALTER TABLE "de_tai_nghien_cuu" DROP CONSTRAINT "fk_dtnc_giang_vien";

-- DropForeignKey
ALTER TABLE "de_tai_nghien_cuu" DROP CONSTRAINT "fk_dtnc_nhom";

-- DropForeignKey
ALTER TABLE "loi_moi_nhom" DROP CONSTRAINT "fk_lmn_nguoi_moi";

-- DropForeignKey
ALTER TABLE "loi_moi_nhom" DROP CONSTRAINT "fk_lmn_nhom";

-- DropForeignKey
ALTER TABLE "loi_moi_nhom" DROP CONSTRAINT "fk_lmn_sinh_vien_duoc_moi";

-- DropForeignKey
ALTER TABLE "nhom_nghien_cuu" DROP CONSTRAINT "fk_nnc_giang_vien";

-- DropForeignKey
ALTER TABLE "nhom_nghien_cuu" DROP CONSTRAINT "fk_nnc_mang";

-- DropForeignKey
ALTER TABLE "nhom_nghien_cuu" DROP CONSTRAINT "fk_nnc_truong_nhom";

-- DropForeignKey
ALTER TABLE "sinh_vien_dang_ky_mang" DROP CONSTRAINT "fk_svdkm_mang_nghien_cuu";

-- DropForeignKey
ALTER TABLE "sinh_vien_dang_ky_mang" DROP CONSTRAINT "fk_svdkm_sinh_vien";

-- DropForeignKey
ALTER TABLE "thanh_vien_nhom_nghien_cuu" DROP CONSTRAINT "fk_tvnnc_nhom";

-- DropForeignKey
ALTER TABLE "thanh_vien_nhom_nghien_cuu" DROP CONSTRAINT "fk_tvnnc_sinh_vien";

-- AlterTable
ALTER TABLE "de_tai_nghien_cuu" ADD COLUMN     "danh_muc_de_tai_giang_vien_id" BIGINT,
ALTER COLUMN "thoi_gian_nop" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "thoi_gian_duyet" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "thoi_gian_chot" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "han_chinh_sua" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ngay_tao" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ngay_cap_nhat" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "giang_vien" ALTER COLUMN "ngay_tao" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ngay_cap_nhat" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "loi_moi_nhom" ALTER COLUMN "thoi_gian_moi" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "thoi_gian_phan_hoi" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ngay_tao" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ngay_cap_nhat" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "mang_nghien_cuu" ALTER COLUMN "thoi_gian_mo_dang_ky" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "thoi_gian_dong_dang_ky" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ngay_tao" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ngay_cap_nhat" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "nhat_ky_kiem_toan" ALTER COLUMN "ngay_tao" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "nhom_nghien_cuu" ALTER COLUMN "ngay_tao" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ngay_cap_nhat" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "sinh_vien" ALTER COLUMN "ngay_tao" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ngay_cap_nhat" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "sinh_vien_dang_ky_mang" ALTER COLUMN "thoi_gian_dang_ky" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ngay_tao" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ngay_cap_nhat" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "thanh_vien_nhom_nghien_cuu" ALTER COLUMN "thoi_gian_tham_gia" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ngay_tao" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ngay_cap_nhat" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "thong_bao" ALTER COLUMN "thoi_gian_doc" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ngay_tao" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ngay_cap_nhat" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "danh_muc_de_tai_giang_vien" (
    "id" BIGSERIAL NOT NULL,
    "giang_vien_id" BIGINT NOT NULL,
    "mang_nghien_cuu_id" BIGINT NOT NULL,
    "ten_de_tai" VARCHAR(255) NOT NULL,
    "mo_ta_van_de" TEXT NOT NULL,
    "muc_tieu_nghien_cuu" TEXT NOT NULL,
    "ung_dung_thuc_tien" TEXT,
    "pham_vi_nghien_cuu" TEXT,
    "cong_nghe_su_dung" TEXT,
    "ly_do_lua_chon" TEXT,
    "trang_thai" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "ngay_tao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ngay_cap_nhat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "danh_muc_de_tai_giang_vien_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_danh_muc_de_tai_giang_vien_id" ON "danh_muc_de_tai_giang_vien"("giang_vien_id");

-- CreateIndex
CREATE INDEX "idx_danh_muc_de_tai_mang_nghien_cuu_id" ON "danh_muc_de_tai_giang_vien"("mang_nghien_cuu_id");

-- CreateIndex
CREATE INDEX "idx_danh_muc_de_tai_trang_thai" ON "danh_muc_de_tai_giang_vien"("trang_thai");

-- CreateIndex
CREATE INDEX "idx_de_tai_nghien_cuu_danh_muc_giang_vien_id" ON "de_tai_nghien_cuu"("danh_muc_de_tai_giang_vien_id");

-- CreateIndex
CREATE INDEX "sinh_vien_dang_ky_mang_mang_nghien_cuu_id_idx" ON "sinh_vien_dang_ky_mang"("mang_nghien_cuu_id");

-- AddForeignKey
ALTER TABLE "sinh_vien_dang_ky_mang" ADD CONSTRAINT "fk_svdkm_sinh_vien" FOREIGN KEY ("sinh_vien_id") REFERENCES "sinh_vien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sinh_vien_dang_ky_mang" ADD CONSTRAINT "fk_svdkm_mang_nghien_cuu" FOREIGN KEY ("mang_nghien_cuu_id") REFERENCES "mang_nghien_cuu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nhom_nghien_cuu" ADD CONSTRAINT "fk_nnc_mang" FOREIGN KEY ("mang_nghien_cuu_id") REFERENCES "mang_nghien_cuu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nhom_nghien_cuu" ADD CONSTRAINT "fk_nnc_truong_nhom" FOREIGN KEY ("truong_nhom_sinh_vien_id") REFERENCES "sinh_vien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nhom_nghien_cuu" ADD CONSTRAINT "fk_nnc_giang_vien" FOREIGN KEY ("giang_vien_id") REFERENCES "giang_vien"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thanh_vien_nhom_nghien_cuu" ADD CONSTRAINT "fk_tvnnc_nhom" FOREIGN KEY ("nhom_nghien_cuu_id") REFERENCES "nhom_nghien_cuu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thanh_vien_nhom_nghien_cuu" ADD CONSTRAINT "fk_tvnnc_sinh_vien" FOREIGN KEY ("sinh_vien_id") REFERENCES "sinh_vien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loi_moi_nhom" ADD CONSTRAINT "fk_lmn_nhom" FOREIGN KEY ("nhom_nghien_cuu_id") REFERENCES "nhom_nghien_cuu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loi_moi_nhom" ADD CONSTRAINT "fk_lmn_nguoi_moi" FOREIGN KEY ("nguoi_moi_sinh_vien_id") REFERENCES "sinh_vien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loi_moi_nhom" ADD CONSTRAINT "fk_lmn_sinh_vien_duoc_moi" FOREIGN KEY ("sinh_vien_duoc_moi_id") REFERENCES "sinh_vien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "de_tai_nghien_cuu" ADD CONSTRAINT "fk_dtnc_nhom" FOREIGN KEY ("nhom_nghien_cuu_id") REFERENCES "nhom_nghien_cuu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "de_tai_nghien_cuu" ADD CONSTRAINT "fk_dtnc_giang_vien" FOREIGN KEY ("giang_vien_id") REFERENCES "giang_vien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "de_tai_nghien_cuu" ADD CONSTRAINT "fk_dtnc_danh_muc_de_tai_giang_vien" FOREIGN KEY ("danh_muc_de_tai_giang_vien_id") REFERENCES "danh_muc_de_tai_giang_vien"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "danh_muc_de_tai_giang_vien" ADD CONSTRAINT "fk_dmdtgv_giang_vien" FOREIGN KEY ("giang_vien_id") REFERENCES "giang_vien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "danh_muc_de_tai_giang_vien" ADD CONSTRAINT "fk_dmdtgv_mang_nghien_cuu" FOREIGN KEY ("mang_nghien_cuu_id") REFERENCES "mang_nghien_cuu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "uq_moi_nhom_mot_de_tai" RENAME TO "de_tai_nghien_cuu_nhom_nghien_cuu_id_key";

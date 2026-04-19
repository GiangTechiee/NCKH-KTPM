-- CreateEnum
CREATE TYPE "ResearchAreaStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('REGISTERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ResearchGroupStatus" AS ENUM ('FORMING', 'FULL', 'WAITING_FOR_LECTURER', 'HAS_LECTURER', 'CHOOSING_TOPIC', 'TOPIC_PENDING', 'TOPIC_APPROVED', 'TOPIC_FINALIZED');

-- CreateEnum
CREATE TYPE "GroupRole" AS ENUM ('LEADER', 'MEMBER');

-- CreateEnum
CREATE TYPE "JoinStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TopicType" AS ENUM ('LECTURER_SUGGESTED', 'GROUP_PROPOSED');

-- CreateEnum
CREATE TYPE "TopicStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'NEEDS_REVISION', 'APPROVED', 'REJECTED', 'FINALIZED');

-- CreateTable
CREATE TABLE "students" (
    "id" BIGSERIAL NOT NULL,
    "student_code" VARCHAR(20) NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "class_name" VARCHAR(50),
    "faculty_name" VARCHAR(100),
    "phone" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecturers" (
    "id" BIGSERIAL NOT NULL,
    "lecturer_code" VARCHAR(20) NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "department_name" VARCHAR(100),
    "specialization" VARCHAR(255),
    "max_group_quota" INTEGER NOT NULL DEFAULT 0,
    "current_group_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lecturers_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "lecturers"
    ADD CONSTRAINT "chk_lecturers_max_group_quota_non_negative" CHECK ("max_group_quota" >= 0),
    ADD CONSTRAINT "chk_lecturers_current_group_count_non_negative" CHECK ("current_group_count" >= 0);

-- CreateTable
CREATE TABLE "research_areas" (
    "id" BIGSERIAL NOT NULL,
    "area_code" VARCHAR(20) NOT NULL,
    "area_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "registration_start" TIMESTAMP(3) NOT NULL,
    "registration_end" TIMESTAMP(3) NOT NULL,
    "status" "ResearchAreaStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_areas_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "research_areas"
    ADD CONSTRAINT "chk_research_areas_time" CHECK ("registration_end" > "registration_start");

-- CreateTable
CREATE TABLE "student_area_registrations" (
    "id" BIGSERIAL NOT NULL,
    "student_id" BIGINT NOT NULL,
    "research_area_id" BIGINT NOT NULL,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'REGISTERED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_area_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_groups" (
    "id" BIGSERIAL NOT NULL,
    "group_name" VARCHAR(100) NOT NULL,
    "research_area_id" BIGINT NOT NULL,
    "leader_student_id" BIGINT NOT NULL,
    "lecturer_id" BIGINT,
    "status" "ResearchGroupStatus" NOT NULL DEFAULT 'FORMING',
    "member_count" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_groups_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "research_groups"
    ADD CONSTRAINT "chk_research_groups_member_count" CHECK ("member_count" >= 1 AND "member_count" <= 3);

-- CreateTable
CREATE TABLE "research_group_members" (
    "id" BIGSERIAL NOT NULL,
    "research_group_id" BIGINT NOT NULL,
    "student_id" BIGINT NOT NULL,
    "role" "GroupRole" NOT NULL,
    "join_status" "JoinStatus" NOT NULL DEFAULT 'PENDING',
    "joined_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_topics" (
    "id" BIGSERIAL NOT NULL,
    "research_group_id" BIGINT NOT NULL,
    "lecturer_id" BIGINT NOT NULL,
    "topic_title" VARCHAR(255) NOT NULL,
    "topic_type" "TopicType" NOT NULL,
    "problem_description" TEXT NOT NULL,
    "research_objective" TEXT NOT NULL,
    "practical_application" TEXT,
    "scope_description" TEXT,
    "technologies" TEXT,
    "reason_for_selection" TEXT,
    "lecturer_feedback" TEXT,
    "revision_note" TEXT,
    "revision_count" INTEGER NOT NULL DEFAULT 0,
    "status" "TopicStatus" NOT NULL DEFAULT 'DRAFT',
    "submitted_at" TIMESTAMP(3),
    "approved_at" TIMESTAMP(3),
    "finalized_at" TIMESTAMP(3),
    "revision_deadline" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_topics_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "research_topics"
    ADD CONSTRAINT "chk_research_topics_revision_count_non_negative" CHECK ("revision_count" >= 0);

-- CreateIndex
CREATE UNIQUE INDEX "students_student_code_key" ON "students"("student_code");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "lecturers_lecturer_code_key" ON "lecturers"("lecturer_code");

-- CreateIndex
CREATE UNIQUE INDEX "lecturers_email_key" ON "lecturers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "research_areas_area_code_key" ON "research_areas"("area_code");

-- CreateIndex
CREATE UNIQUE INDEX "research_areas_area_name_key" ON "research_areas"("area_name");

-- CreateIndex
CREATE INDEX "idx_research_areas_status" ON "research_areas"("status");

-- CreateIndex
CREATE INDEX "student_area_registrations_research_area_id_idx" ON "student_area_registrations"("research_area_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_student_area_active"
    ON "student_area_registrations"("student_id")
    WHERE "status" = 'REGISTERED';

-- CreateIndex
CREATE INDEX "idx_research_groups_status" ON "research_groups"("status");

-- CreateIndex
CREATE INDEX "idx_research_groups_lecturer_id" ON "research_groups"("lecturer_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_group_name_per_area" ON "research_groups"("research_area_id", "group_name");

-- CreateIndex
CREATE INDEX "idx_research_group_members_join_status" ON "research_group_members"("join_status");

-- CreateIndex
CREATE UNIQUE INDEX "uq_group_student" ON "research_group_members"("research_group_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_student_one_active_group"
    ON "research_group_members"("student_id")
    WHERE "join_status" = 'ACCEPTED';

-- CreateIndex
CREATE UNIQUE INDEX "uq_topic_per_group" ON "research_topics"("research_group_id");

-- CreateIndex
CREATE INDEX "idx_research_topics_status" ON "research_topics"("status");

-- CreateIndex
CREATE INDEX "idx_research_topics_lecturer_id" ON "research_topics"("lecturer_id");

-- AddForeignKey
ALTER TABLE "student_area_registrations" ADD CONSTRAINT "student_area_registrations_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_area_registrations" ADD CONSTRAINT "student_area_registrations_research_area_id_fkey" FOREIGN KEY ("research_area_id") REFERENCES "research_areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_groups" ADD CONSTRAINT "research_groups_research_area_id_fkey" FOREIGN KEY ("research_area_id") REFERENCES "research_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_groups" ADD CONSTRAINT "research_groups_leader_student_id_fkey" FOREIGN KEY ("leader_student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_groups" ADD CONSTRAINT "research_groups_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_group_members" ADD CONSTRAINT "research_group_members_research_group_id_fkey" FOREIGN KEY ("research_group_id") REFERENCES "research_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_group_members" ADD CONSTRAINT "research_group_members_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_topics" ADD CONSTRAINT "research_topics_research_group_id_fkey" FOREIGN KEY ("research_group_id") REFERENCES "research_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_topics" ADD CONSTRAINT "research_topics_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateFunction
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CreateTrigger
CREATE TRIGGER trg_students_updated_at
    BEFORE UPDATE ON "students"
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- CreateTrigger
CREATE TRIGGER trg_lecturers_updated_at
    BEFORE UPDATE ON "lecturers"
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- CreateTrigger
CREATE TRIGGER trg_research_areas_updated_at
    BEFORE UPDATE ON "research_areas"
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- CreateTrigger
CREATE TRIGGER trg_student_area_registrations_updated_at
    BEFORE UPDATE ON "student_area_registrations"
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- CreateTrigger
CREATE TRIGGER trg_research_groups_updated_at
    BEFORE UPDATE ON "research_groups"
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- CreateTrigger
CREATE TRIGGER trg_research_group_members_updated_at
    BEFORE UPDATE ON "research_group_members"
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- CreateTrigger
CREATE TRIGGER trg_research_topics_updated_at
    BEFORE UPDATE ON "research_topics"
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

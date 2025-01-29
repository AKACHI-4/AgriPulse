import { prisma } from "@/lib/prisma";
import { MoreHorizontal } from "lucide-react";

const UserCard = async ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {
  const modelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };

  const data = await modelMap[type].count();

  return (
    <div className="rounded-2xl odd:bg-agriPurple even:bg-agriYellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center ">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2025/26
        </span>
        <MoreHorizontal width={28} height={28} />
      </div>
      <h1 className="text-2xl font-semibold my-4 text-gray-800">{data}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2>
    </div>
  );
};

export default UserCard;

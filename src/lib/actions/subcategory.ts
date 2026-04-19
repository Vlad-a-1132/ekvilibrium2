"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminAuth } from "@/lib/auth/admin";
import { isCanonicalMainSlug } from "@/lib/category-canonical";
import { prisma } from "@/lib/prisma";

function slugifyInput(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9а-яё-]/gi, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createSubcategory(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  await requireAdminAuth();
  const name = String(formData.get("name") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const mainCategoryId = String(formData.get("mainCategoryId") ?? "").trim();

  const slug = slugRaw ? slugifyInput(slugRaw) : slugifyInput(name);

  if (!name) {
    return { error: "Укажите название." };
  }
  if (!slug) {
    return { error: "Укажите slug (латиница, цифры, дефис)." };
  }
  if (!mainCategoryId) {
    return { error: "Выберите главную категорию." };
  }

  const main = await prisma.mainCategory.findFirst({
    where: { id: mainCategoryId },
    select: { id: true, slug: true },
  });
  if (!main || !isCanonicalMainSlug(main.slug)) {
    return { error: "Недопустимая главная категория." };
  }

  try {
    await prisma.subCategory.create({
      data: {
        name,
        slug,
        mainCategoryId: main.id,
      },
    });
  } catch {
    return {
      error: "Не удалось создать: возможно, такой slug уже занят.",
    };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/subcategories");
  redirect("/admin/subcategories?created=1");
}

export async function deleteSubcategory(
  subCategoryId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdminAuth();
  const id = subCategoryId.trim();
  if (!id) {
    return { ok: false, error: "Не указана подкатегория." };
  }

  const existing = await prisma.subCategory.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) {
    return { ok: false, error: "Подкатегория не найдена." };
  }

  const productCount = await prisma.product.count({ where: { subCategoryId: id } });
  if (productCount > 0) {
    return {
      ok: false,
      error: "Нельзя удалить подкатегорию, пока в ней есть товары.",
    };
  }

  try {
    await prisma.subCategory.delete({ where: { id } });
  } catch {
    return { ok: false, error: "Не удалось удалить подкатегорию." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/subcategories");
  return { ok: true };
}

export async function updateSubcategoryName(
  subCategoryId: string,
  name: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdminAuth();
  const id = subCategoryId.trim();
  const n = name.trim();
  if (!id) {
    return { ok: false, error: "Не указана подкатегория." };
  }
  if (!n) {
    return { ok: false, error: "Укажите название." };
  }
  if (n.length > 200) {
    return { ok: false, error: "Название не длиннее 200 символов." };
  }

  const existing = await prisma.subCategory.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) {
    return { ok: false, error: "Подкатегория не найдена." };
  }

  try {
    await prisma.subCategory.update({
      where: { id },
      data: { name: n },
    });
  } catch {
    return { ok: false, error: "Не удалось сохранить название." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/subcategories");
  return { ok: true };
}

"use client";

import Image from "next/image";
import { unstable_rethrow, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2, Upload } from "lucide-react";

import {
  createProduct,
  updateProduct,
  type CreateProductInput,
} from "@/lib/actions/product";
import { Button } from "@/components/ui/button";
import { CategorySelector } from "@/components/ui/category-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubcategorySelector } from "@/components/ui/subcategory-selector";
import { Textarea } from "@/components/ui/textarea";
import {
  stockLevelFromDb,
  stockNumberFromLevel,
  type StockLevel,
} from "@/lib/product-stock-level";
import { cn } from "@/lib/utils";

export type ProductFormCategory = {
  id: string;
  name: string;
  slug: string;
  subcategories: { id: string; name: string; slug: string }[];
};

type UploadedImage = {
  key: string;
  path: string;
};

export type ProductFormInitialValues = {
  name: string;
  mainCategoryId: string;
  subcategoryId: string;
  price: string;
  oldPrice: string;
  sku: string;
  stock: string;
  color: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
  images: UploadedImage[];
};

type ProductFormProps =
  | {
      mode: "create";
      categories: ProductFormCategory[];
    }
  | {
      mode: "edit";
      categories: ProductFormCategory[];
      productId: string;
      initialValues: ProductFormInitialValues;
    };

export function ProductForm(props: ProductFormProps) {
  const { categories, mode } = props;
  const productId = props.mode === "edit" ? props.productId : undefined;
  const initial = props.mode === "edit" ? props.initialValues : undefined;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uploadBusy, setUploadBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [name, setName] = useState(initial?.name ?? "");
  const [selectedMain, setSelectedMain] = useState<string | null>(initial?.mainCategoryId ?? null);
  const [subcategoryId, setSubcategoryId] = useState(initial?.subcategoryId ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [oldPrice, setOldPrice] = useState(initial?.oldPrice ?? "");
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [stockLevel, setStockLevel] = useState<StockLevel>(() => {
    if (!initial?.stock) return "low";
    const n = Number.parseInt(initial.stock, 10);
    return stockLevelFromDb(Number.isNaN(n) ? 0 : n);
  });
  const [color, setColor] = useState(initial?.color ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [images, setImages] = useState<UploadedImage[]>(initial?.images ?? []);

  const selectedCategory = categories.find((c) => c.id === selectedMain);
  const subcategories = selectedCategory?.subcategories ?? [];

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploadError(null);
    setUploadBusy(true);
    try {
      const next: UploadedImage[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.set("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });
        const data = (await res.json()) as { path?: string; error?: string };
        if (!res.ok) {
          setUploadError(data.error ?? `Ошибка загрузки (${res.status})`);
          break;
        }
        if (data.path) {
          next.push({ key: crypto.randomUUID(), path: data.path });
        }
      }
      if (next.length) {
        setImages((prev) => [...prev, ...next]);
      }
    } finally {
      setUploadBusy(false);
    }
  }

  function removeImage(key: string) {
    setImages((prev) => prev.filter((i) => i.key !== key));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload: CreateProductInput = {
      name,
      mainCategoryId: selectedMain ?? "",
      subcategoryId: subcategoryId || null,
      price,
      oldPrice: oldPrice || null,
      sku: sku || null,
      stock: String(stockNumberFromLevel(stockLevel)),
      color: color || null,
      description: description || null,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      isActive,
      imagePaths: images.map((i) => i.path),
    };

    startTransition(() => {
      void (async () => {
        try {
          if (mode === "create") {
            const result = await createProduct(payload);
            if (result.ok === true) {
              router.push("/admin/products?created=1");
              return;
            }
            setError(result.error);
          } else {
            const result = await updateProduct({
              ...payload,
              productId: productId!,
            });
            if (result.ok === true) {
              router.push(`/admin/products/${productId}/edit?saved=1`);
              return;
            }
            setError(result.error);
          }
        } catch (e) {
          unstable_rethrow(e);
          console.error(e);
          setError("Не удалось выполнить действие. Попробуйте ещё раз.");
        }
      })();
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-4xl space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Название *</Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Например, Тетрадь А4"
          />
        </div>

        <div className="space-y-6 md:col-span-2">
          <CategorySelector
            items={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
            value={selectedMain}
            onChange={(id) => {
              setSelectedMain(id);
              setSubcategoryId("");
            }}
            label="Основная категория *"
          />
          <SubcategorySelector
            key={selectedMain ?? "none"}
            items={subcategories.map((s) => ({ id: s.id, name: s.name, slug: s.slug }))}
            value={subcategoryId}
            onChange={setSubcategoryId}
            disabled={!selectedMain}
            label="Подкатегория *"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Цена *</Label>
          <Input
            id="price"
            name="price"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="199.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="oldPrice">Старая цена</Label>
          <Input
            id="oldPrice"
            name="oldPrice"
            inputMode="decimal"
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
            placeholder="249.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">
            SKU {mode === "create" ? "*" : ""}
            {mode === "edit" && (
              <span className="ml-1 font-normal text-[#403A34]/55">(необязательно)</span>
            )}
          </Label>
          <Input
            id="sku"
            name="sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required={mode === "create"}
            placeholder={mode === "edit" ? "Укажите уникальный артикул" : "ART-001"}
          />
          {mode === "edit" && (
            <p className="text-xs text-[#403A34]/55">
              Для копий товара SKU часто задают после сохранения карточки.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <span className="block text-sm font-medium leading-none text-[#403A34]">Наличие</span>
          <p className="text-xs text-[#403A34]/55">Без точного количества: только «Мало» или «Много».</p>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStockLevel("low")}
              className={cn(
                "flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                stockLevel === "low"
                  ? "border-[#403A34] bg-[#403A34] text-[#f6f1eb] shadow-sm"
                  : "border-[#403A34]/15 bg-white/90 text-[#403A34] hover:border-[#403A34]/25 hover:bg-white",
              )}
            >
              Мало
            </button>
            <button
              type="button"
              onClick={() => setStockLevel("high")}
              className={cn(
                "flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                stockLevel === "high"
                  ? "border-[#403A34] bg-[#403A34] text-[#f6f1eb] shadow-sm"
                  : "border-[#403A34]/15 bg-white/90 text-[#403A34] hover:border-[#403A34]/25 hover:bg-white",
              )}
            >
              Много
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Цвет</Label>
          <Input id="color" name="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>

        <div className="flex items-center gap-3 pt-8 md:col-span-2">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="size-4 rounded border-[#403A34]/30 text-[#403A34] focus:ring-[#403A34]/25"
          />
          <Label htmlFor="isActive" className="cursor-pointer font-normal">
            Товар активен (виден на витрине)
          </Label>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seoTitle">SEO title</Label>
          <Input id="seoTitle" name="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seoDescription">SEO description</Label>
          <Textarea
            id="seoDescription"
            name="seoDescription"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#403A34]/10 bg-[#fbf8f4] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#403A34]">Изображения</p>
            <p className="mt-1 text-xs text-[#403A34]/60">
              JPG, PNG или WebP до 5 МБ. Первая картинка станет основной на витрине.
            </p>
          </div>
          <label className="inline-flex cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              disabled={uploadBusy || isPending}
              onChange={(e) => void uploadFiles(e.target.files)}
            />
            <span className="inline-flex items-center gap-2 rounded-md border border-[#403A34]/20 bg-white px-4 py-2 text-sm text-[#403A34] hover:bg-[#403A34]/5">
              <Upload className="size-4" aria-hidden />
              {uploadBusy ? "Загрузка…" : "Выбрать файлы"}
            </span>
          </label>
        </div>
        {uploadError && <p className="mt-3 text-sm text-red-700">{uploadError}</p>}

        {images.length > 0 && (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {images.map((img, index) => (
              <li
                key={img.key}
                className="relative overflow-hidden rounded-xl border border-[#403A34]/10 bg-white"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={img.path}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 p-2 text-xs text-[#403A34]/70">
                  <span>{index === 0 ? "Основное" : `Фото ${index + 1}`}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(img.key)}
                    className="inline-flex rounded-md p-1.5 text-[#403A34] hover:bg-[#403A34]/10"
                    aria-label="Удалить изображение"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending || uploadBusy}>
          {isPending ? "Сохранение…" : mode === "create" ? "Создать товар" : "Сохранить изменения"}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { createSubcategory } from "@/lib/actions/subcategory";
import { Button } from "@/components/ui/button";
import { CategorySelector } from "@/components/ui/category-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type MainOption = { id: string; name: string; slug: string };

type SubcategoryCreateFormProps = {
  mainCategories: MainOption[];
};

function SubmitButton({ mainId }: { mainId: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !mainId}>
      {pending ? "Сохранение…" : "Создать подкатегорию"}
    </Button>
  );
}

export function SubcategoryCreateForm({ mainCategories }: SubcategoryCreateFormProps) {
  const [state, formAction] = useActionState(createSubcategory, null);
  const [mainId, setMainId] = useState<string>("");

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </div>
      )}

      <CategorySelector
        items={mainCategories.map((m) => ({ id: m.id, name: m.name, slug: m.slug }))}
        value={mainId || null}
        onChange={(id) => setMainId(id ?? "")}
        hiddenInputName="mainCategoryId"
        label="Главная категория *"
      />

      <div className="space-y-2">
        <Label htmlFor="name">Название *</Label>
        <Input id="name" name="name" required placeholder="Например, Скетчбуки" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input id="slug" name="slug" required placeholder="sketchbuki" />
        <p className="text-xs text-[#403A34]/55">Уникальный в пределах всей базы.</p>
      </div>

      <SubmitButton mainId={mainId} />
    </form>
  );
}

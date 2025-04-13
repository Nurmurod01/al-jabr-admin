"use client";

import { useState } from "react";
import {
  useGetClassesQuery,
  useDeleteClassMutation,
  useUpdateClassMutation,
} from "@/service/classApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader2, Trash, Pencil } from "lucide-react";

export default function ClassPage() {
  const { data: classes, isLoading } = useGetClassesQuery();
  const [deleteClass] = useDeleteClassMutation();
  const [updateClass] = useUpdateClassMutation();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({ uz: "", ru: "" });

  const openEditModal = (cls) => {
    setSelectedClass(cls);
    setFormData({ uz: cls.name.uz, ru: cls.name.ru });
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this class?")) {
      await deleteClass(id);
    }
  };

  const handleUpdate = async () => {
    if (!selectedClass) return;
    await updateClass({
      id: selectedClass.id,
      body: {
        name: {
          uz: formData.uz,
          ru: formData.ru,
        },
      },
    });
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-black" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-black mb-4">Class List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {classes?.map((cls) => (
          <Card
            key={cls.id}
            className="border-black border-2 hover:shadow-xl transition cursor-pointer"
          >
            <CardContent
              className="p-4 space-y-2"
              onClick={() => router.push(`/class/${cls.id}`)}
            >
              <h2 className="text-xl font-semibold text-black">
                {cls.name.uz} / {cls.name.ru}
              </h2>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-black border-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(cls);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Update
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(cls.id);
                  }}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={formData.uz}
              placeholder="Name in Uzbek"
              onChange={(e) => setFormData({ ...formData, uz: e.target.value })}
            />
            <Input
              value={formData.ru}
              placeholder="Name in Russian"
              onChange={(e) => setFormData({ ...formData, ru: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

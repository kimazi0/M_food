"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon, X, Check } from "lucide-react";
import Image from "next/image";
import { upsertMenuItem, deleteMenuItem } from "@/lib/actions/menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCategory, deleteCategory } from "@/lib/actions/categories";
import { ShareMenuModal } from "./ShareMenuModal";
import { Share2 } from "lucide-react";

export function MenuEditor({ initialItems, initialCategories }: { initialItems: any[], initialCategories: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenModal = (item: any = null) => {
    setEditingItem(item || { name: "", description: "", price: 0, categoryName: categories[0]?.name || "", image: "", available: true });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await upsertMenuItem(editingItem);
    if (result.success) {
      setIsModalOpen(false);
      // In a real app we'd refresh or the server would revalidate
      // For instant feel we can refresh page
      window.location.reload(); 
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exquisite dish?")) return;
    setLoading(true);
    const result = await deleteMenuItem(id);
    if (result.success) {
      setItems(items.filter(i => i.id !== id));
    }
    setLoading(false);
  };

  return (
    <div className="p-8 h-full flex flex-col space-y-8 relative">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-heading font-black text-4xl uppercase tracking-tighter text-white">
            Menu <span className="text-primary italic">Atelier</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Curate the Gastronomic Catalog</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="group flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <Share2 className="w-4 h-4 text-primary group-hover:scale-125 transition-transform" /> Share Menu
          </button>
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="group flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            Manage Genres
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="group flex items-center gap-3 bg-primary px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs text-secondary shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Add Masterpiece
          </button>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-md">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 bg-black/40 border-b border-white/5">
            <tr>
              <th className="px-8 py-5">Dish Details</th>
              <th className="px-8 py-5">Category</th>
              <th className="px-8 py-5">Investment</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Craft</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {items.map((item) => (
              <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-5">
                    <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 group-hover:border-primary/40 transition-colors">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center opacity-20"><ImageIcon className="w-6 h-6" /></div>
                      )}
                    </div>
                    <div>
                      <div className="font-heading font-black text-lg text-white group-hover:text-primary transition-colors">{item.name}</div>
                      <div className="text-xs text-zinc-500 line-clamp-1 max-w-[300px] mt-0.5">{item.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    {item.categoryName}
                  </span>
                </td>
                <td className="px-8 py-5 font-mono font-bold text-white text-base">
                  ${item.price.toFixed(2)}
                </td>
                <td className="px-8 py-5">
                  {item.available ? (
                    <div className="flex items-center gap-2 text-emerald-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-zinc-600">
                       <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Resting</span>
                    </div>
                  )}
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => handleOpenModal(item)}
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all border border-white/5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modern Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-[#0a0a0c] border border-white/10 rounded-[40px] p-8 md:p-10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] overflow-hidden">
             <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
             
             <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading font-black text-3xl uppercase tracking-tighter text-white">
                  {editingItem?.id ? "Edit" : "New"} <span className="text-primary italic">Dish</span>
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
             </div>

             <form onSubmit={handleSave} className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Identity</Label>
                   <Input 
                     value={editingItem.name}
                     onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                     className="bg-white/5 border-white/10 h-12 rounded-2xl focus:border-primary font-bold text-white"
                     placeholder="Spicy Volcano Burger"
                     required
                   />
                 </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Genre</Label>
                    <div className="relative">
                      <select 
                        value={editingItem.categoryName}
                        onChange={(e) => setEditingItem({...editingItem, categoryName: e.target.value})}
                        className="w-full bg-[#1C1917] border border-white/10 h-12 rounded-2xl focus:border-primary font-bold text-white px-4 text-sm appearance-none outline-none ring-primary/20 focus:ring-4 transition-all cursor-pointer"
                        style={{ backgroundColor: '#1C1917', color: 'white' }}
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.name} style={{ backgroundColor: '#1C1917', color: 'white' }}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        <Plus className="w-4 h-4 rotate-45" />
                      </div>
                    </div>
                  </div>
               </div>

               <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">The Experience (Description)</Label>
                 <Textarea 
                   value={editingItem.description}
                   onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                   className="bg-white/5 border-white/10 rounded-2xl focus:border-primary font-medium text-white min-h-[100px]"
                   placeholder="Describe the sensory journey of this dish..."
                   required
                 />
               </div>

               <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Investment (Price)</Label>
                   <Input 
                     type="number"
                     step="0.01"
                     value={editingItem.price}
                     onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
                     className="bg-white/5 border-white/10 h-12 rounded-2xl focus:border-primary font-bold text-white"
                     required
                   />
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Availability</Label>
                   <div className="flex items-center h-12 gap-3 px-4 bg-white/5 border border-white/10 rounded-2xl">
                     <input 
                       type="checkbox"
                       checked={editingItem.available}
                       onChange={(e) => setEditingItem({...editingItem, available: e.target.checked})}
                       className="w-4 h-4 rounded border-white/10 bg-black/20 text-primary focus:ring-primary inline-block"
                     />
                     <span className="text-xs font-bold text-zinc-400">Available for Order</span>
                   </div>
                 </div>
               </div>

               <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Visual Asset</Label>
                 <div className="flex gap-4">
                   <Input 
                     value={editingItem.image}
                     onChange={(e) => setEditingItem({...editingItem, image: e.target.value})}
                     className="flex-1 bg-white/5 border-white/10 h-12 rounded-2xl focus:border-primary font-medium text-white"
                     placeholder="https://images.unsplash.com/..."
                   />
                   <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        id="image-upload"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          setLoading(true);
                          const formData = new FormData();
                          formData.append("file", file);
                          
                          try {
                            const res = await fetch("/api/upload", {
                              method: "POST",
                              body: formData
                            });
                            const data = await res.json();
                            if (data.url) {
                              setEditingItem({...editingItem, image: data.url});
                            }
                          } catch (err) {
                            console.error("Upload failed", err);
                          } finally {
                            setLoading(false);
                          }
                        }}
                      />
                      <label 
                        htmlFor="image-upload"
                        className="flex items-center gap-2 h-12 px-6 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[9px] text-zinc-400"
                      >
                       <ImageIcon className="w-4 h-4 text-primary" /> 
                       {loading ? "Uploading..." : "Import Photo"}
                      </label>
                   </div>
                 </div>
               </div>

               <button 
                 disabled={loading}
                 className="w-full h-14 bg-primary rounded-2xl font-black uppercase tracking-widest text-xs text-white shadow-xl shadow-primary/20 hover:brightness-110 disabled:opacity-50 mt-4 transition-all flex items-center justify-center gap-3"
               >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-4 h-4" /> Save Masterpiece</>}
               </button>
             </form>
          </div>
        </div>
      )}
      {/* Genre Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setIsCategoryModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#0C0A09] border border-white/10 rounded-[40px] p-8 shadow-2xl">
             <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading font-black text-2xl uppercase tracking-tighter text-white">
                  Genre <span className="text-primary italic">Atelier</span>
                </h2>
                <button onClick={() => setIsCategoryModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
             </div>

             <div className="space-y-6">
                <div className="flex gap-2">
                  <Input 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New genre name..."
                    className="bg-stone-900 border-white/10 h-12 rounded-2xl focus:border-primary font-medium text-white"
                  />
                  <button 
                    onClick={async () => {
                      if (!newCategoryName) return;
                      const res = await createCategory(newCategoryName);
                      if (res.success) {
                        setCategories([...categories, { name: newCategoryName, id: Math.random().toString() }]);
                        setNewCategoryName("");
                      }
                    }}
                    className="bg-primary text-secondary h-12 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:brightness-110 active:scale-95 transition-all"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/10 transition-all">
                      <span className="font-bold text-sm text-zinc-300">{cat.name}</span>
                      <button 
                        onClick={async () => {
                          if (confirm(`Delete ${cat.name}? Items in this category might break.`)) {
                            const res = await deleteCategory(cat.id);
                            if (res.success) {
                              setCategories(categories.filter(c => c.id !== cat.id));
                            }
                          }
                        }}
                        className="text-red-500/50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      )}
      <ShareMenuModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
}

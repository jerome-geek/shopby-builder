import { create } from 'zustand';
import { PageSchema, Block } from '../lib/validators';

interface BuilderState {
    pageId: string | null;
    draftSchema: PageSchema | null;
    setPageId: (id: string) => void;
    setSchema: (schema: PageSchema) => void;
    addBlock: (block: Block) => void;
    updateBlock: (id: string, props: Partial<Block>) => void;
    removeBlock: (id: string) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
    pageId: null,
    draftSchema: null,
    setPageId: (id) => set({ pageId: id }),
    setSchema: (schema) => set({ draftSchema: schema }),
    addBlock: (block) =>
        set((state) => ({
            draftSchema: state.draftSchema
                ? {
                      ...state.draftSchema,
                      blocks: [...state.draftSchema.blocks, block],
                  }
                : { blocks: [block] },
        })),
    updateBlock: (id, updates) =>
        set((state) => {
            if (!state.draftSchema) return state;
            return {
                draftSchema: {
                    ...state.draftSchema,
                    blocks: state.draftSchema.blocks.map((b) =>
                        b.id === id ? { ...b, ...updates } : b,
                    ),
                },
            };
        }),
    removeBlock: (id) =>
        set((state) => {
            if (!state.draftSchema) return state;
            return {
                draftSchema: {
                    ...state.draftSchema,
                    blocks: state.draftSchema.blocks.filter((b) => b.id !== id),
                },
            };
        }),
}));

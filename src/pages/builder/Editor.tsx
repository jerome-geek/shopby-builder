import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useBuilderStore } from '../../store/useBuilderStore';
import {
    useGetPage,
    useSavePageDraft,
    usePublishPage,
} from '../../lib/api/queries/usePageQueries';
import HeroBannerBlock from '../../components/blocks/HeroBanner/HeroBannerBlock';
import { HeroBannerProperties } from '../../components/blocks/HeroBanner/HeroBannerProperties';
import HeaderBlock from '../../components/blocks/Header/HeaderBlock';
import FooterBlock from '../../components/blocks/Footer/FooterBlock';

const BlockRegistry: Record<string, React.FC<any>> = {
    HeroBanner: HeroBannerBlock,
    Header: HeaderBlock,
    Footer: FooterBlock,
};

const renderBlock = (block: any) => {
    const Component = BlockRegistry[block.type];
    if (!Component) {
        return (
            <div className="p-4 bg-red-50 text-red-500 border border-red-200">
                Unknown block type: {block.type}
            </div>
        );
    }
    return <Component {...block.props} />;
};

const PropertyFormRegistry: Record<string, React.FC<any>> = {
    HeroBanner: HeroBannerProperties,
};

const renderPropertyForm = (block: any) => {
    const Component = PropertyFormRegistry[block.type];
    if (!Component) {
        return (
            <div className="text-gray-400 text-sm text-center py-10">
                No properties editor available for {block.type}
            </div>
        );
    }
    return <Component blockId={block.id} initialData={block.props} />;
};

const Editor: React.FC = () => {
    const { pageId } = useParams<{ pageId: string }>();
    const navigate = useNavigate();
    const { draftSchema, setPageId, setSchema, addBlock } = useBuilderStore();
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

    // Data Fetching
    const { data: pageData, isLoading, isError } = useGetPage(pageId);
    // Mutations
    const savePageMut = useSavePageDraft();
    const publishPageMut = usePublishPage();

    useEffect(() => {
        if (pageId && pageData) {
            setPageId(pageId);
            setSchema(pageData.draftSchema);
        }
    }, [pageId, pageData, setPageId, setSchema]);

    const handleSave = () => {
        if (pageId && draftSchema) {
            savePageMut.mutate(
                { pageId, schema: draftSchema },
                {
                    onSuccess: () => alert('Saved Draft!'),
                },
            );
        }
    };

    const handlePublish = () => {
        if (pageId && draftSchema) {
            savePageMut.mutate(
                { pageId, schema: draftSchema },
                {
                    onSuccess: () => {
                        publishPageMut.mutate(pageId, {
                            onSuccess: () => alert('Published Live!'),
                        });
                    },
                },
            );
        }
    };

    const handleAddBlock = () => {
        const newBlockId = `block-${Date.now()}`;
        addBlock({
            id: newBlockId,
            type: 'HeroBanner',
            order: draftSchema?.blocks.length || 0,
            props: {
                swiperOptions: {
                    loop: true,
                    pagination: true,
                    navigation: true,
                },
                items: [
                    {
                        id: `item-${Date.now()}-1`,
                        imageUrl:
                            'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
                        content: {
                            title: 'New Banner',
                            titleColor: '#ffffff',
                            position: 'center',
                        },
                    },
                ],
            },
        });
        setSelectedBlockId(newBlockId);
    };

    if (isLoading) return <div className="p-8">Loading Builder...</div>;
    if (isError)
        return (
            <div className="p-8 text-red-500">
                Error loading page. Please refresh or check if page exists.
            </div>
        );
    if (!draftSchema) return <div className="p-8">Preparing Canvas...</div>;

    const selectedBlock = draftSchema.blocks.find(
        (b) => b.id === selectedBlockId,
    );

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Left Sidebar (Blocks) */}
            <div className="w-64 border-r bg-gray-50 flex flex-col flex-shrink-0">
                <div className="p-4 border-b font-bold flex justify-between items-center bg-white">
                    <span>Blocks</span>
                    <button
                        onClick={() => navigate('/builder/dashboard')}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Back
                    </button>
                </div>
                <div className="p-4 flex-1 overflow-y-auto space-y-2">
                    <button
                        onClick={handleAddBlock}
                        className="w-full text-left p-3 border rounded bg-white shadow-sm hover:border-blue-500 transition-colors"
                    >
                        + Add Hero Banner
                    </button>
                </div>
            </div>

            {/* Center Canvas */}
            <div className="flex-1 bg-gray-100 p-8 overflow-y-auto flex flex-col">
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Canvas (Draft)</h2>
                    <div className="space-x-2">
                        <button
                            onClick={handleSave}
                            disabled={savePageMut.isPending}
                            className="px-4 py-2 border rounded bg-white shadow-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            {savePageMut.isPending ? 'Saving...' : 'Save Draft'}
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={
                                publishPageMut.isPending ||
                                savePageMut.isPending
                            }
                            className="px-4 py-2 bg-green-600 shadow-sm text-white rounded disabled:opacity-50 hover:bg-green-700 transition-colors"
                        >
                            {publishPageMut.isPending
                                ? 'Publishing...'
                                : 'Publish Live'}
                        </button>
                    </div>
                </div>

                <div
                    className="bg-white flex-1 min-h-[600px] shadow-sm rounded border flex flex-col overflow-y-auto"
                    onClick={(e) => {
                        // 캔버스 빈 공간 클릭 시 선택 해제
                        if (e.target === e.currentTarget) {
                            setSelectedBlockId(null);
                        }
                    }}
                >
                    {/* 상단 Header 고정 영역 (레이아웃뷰) */}
                    <div className="w-full pointer-events-none opacity-80 border-b-2 border-dashed border-gray-200">
                        <HeaderBlock
                            title="Shopby Logo"
                            navigationItems={[
                                { label: 'Shop', href: '#' },
                                { label: 'About', href: '#' },
                            ]}
                        />
                    </div>

                    <div className="flex-1 p-4 relative min-h-[300px]">
                        {draftSchema.blocks.length === 0 ? (
                            <div className="text-gray-400 absolute inset-0 flex items-center justify-center pointer-events-none">
                                Empty Page. Add blocks from the left.
                            </div>
                        ) : (
                            draftSchema.blocks.map((block) => {
                                const isSelected = selectedBlockId === block.id;
                                return (
                                    <div
                                        key={block.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedBlockId(block.id);
                                        }}
                                        className={`relative group transition-all mb-4 cursor-pointer outline outline-2 outline-offset-2 rounded-sm ${isSelected ? 'outline-blue-500 shadow-md' : 'outline-transparent hover:outline-blue-300'}`}
                                    >
                                        <div
                                            className={`absolute top-2 right-2 z-50 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                        >
                                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded shadow">
                                                {block.type}
                                            </span>
                                        </div>
                                        <div className="pointer-events-none">
                                            {renderBlock(block)}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* 하단 Footer 고정 영역 (레이아웃뷰) */}
                    <div className="w-full pointer-events-none opacity-80 border-t-2 border-dashed border-gray-200 mt-auto">
                        <FooterBlock
                            companyName="Shopby Builder"
                            copyrightYear="2026"
                        />
                    </div>
                </div>
            </div>

            {/* Right Sidebar (Property Editor) */}
            <div className="w-80 border-l bg-white flex flex-col flex-shrink-0">
                <div className="p-4 border-b font-bold bg-gray-50">
                    Properties
                </div>
                <div className="p-4 flex-1 overflow-y-auto">
                    {selectedBlock ? (
                        <div className="space-y-4">
                            <div className="p-3 bg-blue-50 text-blue-800 rounded border border-blue-100 text-sm mb-4">
                                Editing: <strong>{selectedBlock.type}</strong>
                            </div>
                            {renderPropertyForm(selectedBlock)}
                        </div>
                    ) : (
                        <div className="text-gray-400 text-sm text-center py-10">
                            Select a block to edit its properties
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Editor;

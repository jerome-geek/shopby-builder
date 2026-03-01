import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { MockApi } from '../../lib/mockApi';
import { useBuilderStore } from '../../store/useBuilderStore';

const Editor: React.FC = () => {
    const { pageId } = useParams<{ pageId: string }>();
    const navigate = useNavigate();
    const { draftSchema, setPageId, setSchema, addBlock } = useBuilderStore();

    useEffect(() => {
        if (pageId) {
            const page = MockApi.getPageById(pageId);
            if (page) {
                setPageId(pageId);
                setSchema(page.draftSchema);
            }
        }
    }, [pageId, setPageId, setSchema]);

    const handleSave = () => {
        if (pageId && draftSchema) {
            MockApi.savePageDraft(pageId, draftSchema);
            alert('Saved!');
        }
    };

    const handlePublish = () => {
        if (pageId && draftSchema) {
            MockApi.savePageDraft(pageId, draftSchema);
            MockApi.publishPage(pageId);
            alert('Published!');
        }
    };

    const handleAddBlock = () => {
        addBlock({
            id: `block-${Date.now()}`,
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
    };

    if (!draftSchema) return <div>Loading...</div>;

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar Menu */}
            <div className="w-64 border-r bg-gray-50 flex flex-col">
                <div className="p-4 border-b font-bold flex justify-between items-center">
                    <span>Blocks</span>
                    <button
                        onClick={() => navigate('/builder/dashboard')}
                        className="text-sm text-blue-600"
                    >
                        Back
                    </button>
                </div>
                <div className="p-4 flex-1 overflow-y-auto space-y-2">
                    <button
                        onClick={handleAddBlock}
                        className="w-full text-left p-3 border rounded bg-white shadow-sm hover:border-blue-500"
                    >
                        + Add Hero Banner
                    </button>
                </div>
            </div>

            {/* Editor Canvas */}
            <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Canvas (Draft)</h2>
                    <div className="space-x-2">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 border rounded bg-white"
                        >
                            Save Draft
                        </button>
                        <button
                            onClick={handlePublish}
                            className="px-4 py-2 bg-green-600 text-white rounded"
                        >
                            Publish Live
                        </button>
                    </div>
                </div>

                <div className="bg-white min-h-[600px] shadow rounded border p-4">
                    {draftSchema.blocks.length === 0 ? (
                        <div className="text-gray-400 text-center py-20">
                            Empty Page. Add blocks from the left.
                        </div>
                    ) : (
                        draftSchema.blocks.map((block) => (
                            <div
                                key={block.id}
                                className="border-2 border-dashed border-gray-300 p-4 mb-4 relative hover:border-blue-500"
                            >
                                <span className="absolute top-2 right-2 text-xs bg-gray-200 px-2 rounded">
                                    {block.type}
                                </span>
                                <div className="font-medium mb-2">
                                    {block.type}
                                </div>
                                <pre className="text-xs bg-gray-50 p-2 overflow-x-auto">
                                    {JSON.stringify(block.props, null, 2)}
                                </pre>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Editor;

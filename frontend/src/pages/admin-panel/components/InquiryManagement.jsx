import React, { useState, useEffect } from 'react';
import { Mail, Phone, User, Calendar, MessageSquare, Search, Filter, Trash2 } from 'lucide-react';
import Icon from '../../../components/AppIcon';

const InquiryManagement = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/contact/all');
            if (response.ok) {
                const data = await response.json();
                // Sort by date descending
                const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setInquiries(sorted);

                // After fetching, mark all unread inquiries as viewed
                const unreadIds = sorted.filter(inq => !inq.viewed).map(inq => inq.id);
                if (unreadIds.length > 0) {
                    await markMultipleAsViewed(unreadIds);
                }
            }
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const markMultipleAsViewed = async (ids) => {
        try {
            // Process marks sequentially to ensure database consistency
            for (const id of ids) {
                await fetch(`http://localhost:8080/api/contact/mark-viewed/${id}`, {
                    method: 'POST'
                });
            }
        } catch (error) {
            console.error('Error marking inquiries as viewed:', error);
        }
    };

    const filteredInquiries = inquiries.filter(inquiry => {
        // ... existing filter logic ...
        const matchesSearch =
            inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    const formatDate = (dateString) => {
        // ... existing formatDate logic ...
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        // ... existing loading logic ...
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading inquiries...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-foreground">Customer Inquiries</h2>
                    <p className="text-muted-foreground">Manage and respond to customer messages</p>
                </div>
                <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-lg">
                    <MessageSquare className="text-primary" size={20} />
                    <span className="font-heading font-bold text-primary">{inquiries.length} Total</span>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or content..."
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Inquiries List */}
            <div className="grid gap-6">
                {filteredInquiries.length > 0 ? (
                    filteredInquiries.map((inquiry) => (
                        <div key={inquiry.id} className={`bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${!inquiry.viewed ? 'border-primary shadow-primary/10 bg-primary/5' : 'border-border'}`}>
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    {/* Left: User Info */}
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${!inquiry.viewed ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-accent/20 text-accent'}`}>
                                                    <User size={24} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-heading font-bold text-lg text-foreground">{inquiry.name}</h3>
                                                        {!inquiry.viewed && (
                                                            <span className="bg-accent text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full animate-pulse">
                                                                New Message
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground space-x-4">
                                                        <span className="flex items-center"><Mail size={14} className="mr-1" /> {inquiry.email}</span>
                                                        {inquiry.phone && <span className="flex items-center"><Phone size={14} className="mr-1" /> {inquiry.phone}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center text-sm text-muted-foreground justify-end">
                                                    <Calendar size={14} className="mr-1" />
                                                    {formatDate(inquiry.createdAt)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-border pt-4">
                                            <div className="mb-2">
                                                <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-1 rounded">
                                                    Subject: {inquiry.subject || 'No Subject'}
                                                </span>
                                            </div>
                                            <p className="text-foreground leading-relaxed whitespace-pre-wrap italic bg-muted/30 p-4 rounded-lg border-l-4 border-primary">
                                                "{inquiry.message}"
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-end space-x-3 pt-2">
                                            <a
                                                href={`mailto:${inquiry.email}?subject=RE: ${inquiry.subject || 'Inquiry from Sanatana Parampare'}`}
                                                className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                                            >
                                                <Mail size={16} />
                                                <span>Reply via Email</span>
                                            </a>
                                            {inquiry.phone && (
                                                <a
                                                    href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-2 bg-success text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-success/90 transition-colors"
                                                >
                                                    <Icon name="MessageCircle" size={16} />
                                                    <span>WhatsApp</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-card border border-border border-dashed rounded-xl p-12 text-center text-muted-foreground">
                        <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No inquiries found</p>
                        <p className="text-sm">Try adjusting your search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InquiryManagement;

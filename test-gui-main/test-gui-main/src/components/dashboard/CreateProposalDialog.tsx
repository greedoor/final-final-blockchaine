import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useWeb3 } from '@/hooks/useWeb3';

export const CreateProposalDialog = () => {
    const { createProposal, isMember, contractBalance } = useWeb3();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        recipient: '',
        amount: '',
        description: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.recipient || !formData.amount || !formData.description) return;

        // Sanitize input: replace comma with dot
        const sanitizedAmount = formData.amount.replace(',', '.');
        const amountValue = parseFloat(sanitizedAmount);
        const contractBalanceValue = parseFloat(contractBalance);

        if (amountValue > contractBalanceValue) {
            alert(`Erreur: Solde insuffisant ! Le contrat n'a que ${contractBalanceValue} ETH. Impossible de demander ${amountValue} ETH.`);
            return;
        }

        setIsLoading(true);
        try {
            const success = await createProposal(
                formData.description.split('\n')[0],
                formData.description,
                sanitizedAmount,
                formData.recipient
            );
            if (success) {
                setOpen(false);
                setFormData({ recipient: '', amount: '', description: '' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isMember) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle Proposition
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Créer une Proposition</DialogTitle>
                        <DialogDescription>
                            Soumettez une nouvelle demande de fonds au club.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="recipient" className="text-sm font-medium">Destinataire (Adresse)</label>
                            <Input
                                id="recipient"
                                placeholder="0x..."
                                value={formData.recipient}
                                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                                required
                                className="font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="amount" className="text-sm font-medium">Montant (ETH)</label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.001"
                                placeholder="0.1"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">Description</label>
                            <Textarea
                                id="description"
                                placeholder="Expliquez l'objectif de ces fonds..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                        <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Création...
                                </>
                            ) : (
                                'Créer la Proposition'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

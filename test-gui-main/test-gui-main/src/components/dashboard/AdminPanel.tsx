import { useState } from 'react';
import { UserPlus, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/hooks/useWeb3';

interface AdminPanelProps {
  onAddMember: (address: string) => Promise<boolean>;
  onRemoveMember: (address: string) => Promise<boolean>;
  onSetQuorum: (newQuorum: number) => Promise<boolean>;
  isConnected: boolean;
}

export const AdminPanel = ({ onAddMember, onRemoveMember, onSetQuorum, isConnected }: AdminPanelProps) => {
  const { toast } = useToast();
  const { membersList, account, majorityNeeded } = useWeb3();
  const [memberAddress, setMemberAddress] = useState('');
  const [newQuorumValue, setNewQuorumValue] = useState(majorityNeeded.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: 'add' | 'remove', address?: string) => {
    const targetAddress = address || memberAddress;

    if (!targetAddress || !/^0x[a-fA-F0-9]{40}$/.test(targetAddress)) {
      toast({
        title: "Adresse invalide",
        description: "Veuillez entrer une adresse Ethereum valide",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = action === 'add'
        ? await onAddMember(targetAddress)
        : await onRemoveMember(targetAddress);

      if (success && !address) {
        setMemberAddress('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900">Administration</h2>
          <p className="text-xs text-gray-500">Gérer les membres du SafeClub</p>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {/* Formulaire d'ajout */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
            Nouveau Membre
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="0x..."
              value={memberAddress}
              onChange={(e) => setMemberAddress(e.target.value)}
              className="font-mono text-sm"
              disabled={!isConnected || isLoading}
            />
            <Button
              onClick={() => handleAction('add')}
              disabled={!isConnected || isLoading || !memberAddress}
              className="bg-indigo-600 hover:bg-indigo-700"
              size="sm"
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Liste des membres */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
            Membres Actuels ({membersList.length})
          </label>
          <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
              {membersList.map((mAddr) => (
                <div key={mAddr} className="flex items-center justify-between p-3 group hover:bg-white transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-sm font-mono text-gray-700">
                      {mAddr.substring(0, 6)}...{mAddr.substring(38)}
                    </span>
                    {mAddr.toLowerCase() === account?.toLowerCase() && (
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 rounded font-bold">MOI</span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAction('remove', mAddr)}
                    disabled={isLoading || mAddr.toLowerCase() === account?.toLowerCase()}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Paramètres Gouvernance */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
            Seuil de Quorum
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              min="1"
              value={newQuorumValue}
              onChange={(e) => setNewQuorumValue(e.target.value)}
              className="text-sm"
              disabled={!isConnected || isLoading}
            />
            <Button
              onClick={async () => {
                setIsLoading(true);
                try {
                  await onSetQuorum(parseInt(newQuorumValue));
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={!isConnected || isLoading || parseInt(newQuorumValue) === majorityNeeded}
              variant="outline"
              size="sm"
            >
              Mettre à jour
            </Button>
          </div>
          <p className="text-[10px] text-gray-400">
            Minimum de votes "POUR" requis pour valider une proposition.
          </p>
        </div>

        {!isConnected && (
          <p className="text-xs text-red-500 text-center py-2 bg-red-50 rounded">
            Connectez votre wallet admin
          </p>
        )}
      </div>
    </div>
  );
};

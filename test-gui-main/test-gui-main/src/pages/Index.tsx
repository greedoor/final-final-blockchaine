import { RefreshCw, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/dashboard/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProposalList } from '@/components/dashboard/ProposalList';
import { CreateProposalDialog } from '@/components/dashboard/CreateProposalDialog';
import { AdminPanel } from '@/components/dashboard/AdminPanel';
import { ExecutionPanel } from '@/components/dashboard/ExecutionPanel';
import { useWeb3 } from '@/hooks/useWeb3';

const Index = () => {
  try {
    const {
      account,
      balance,
      isMember,
      isOwner,
      isConnecting,
      contractBalance,
      totalMembers,
      majorityNeeded,
      proposals,
      refresh,
      addMember,
      removeMember,
      depositFunds,
      connectWallet,
      setQuorum
    } = useWeb3();

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <Header />

        {/* Main Content */}
        {!account ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 text-center">
            <div className="max-w-md w-full p-10 bg-white rounded-3xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500">
              <div className="bg-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Wallet className="w-10 h-10 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Bienvenue dans SafeClub</h2>
              <p className="text-gray-600 mb-10 leading-relaxed">
                Connectez votre portefeuille MetaMask pour accéder à la gouvernance et au trésor de votre club.
              </p>
              <Button
                onClick={() => {
                  console.log("Connect button clicked in Index");
                  connectWallet();
                }}
                className="w-full py-7 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
              >
                <Wallet className="w-5 h-5 mr-3" />
                Se connecter avec MetaMask
              </Button>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <StatCard
                title="Solde du Contrat"
                value={`${parseFloat(contractBalance).toFixed(4)} ETH`}
                subtitle="Fonds totaux verrouillés"
              />
              <StatCard
                title="Majorité Requise"
                value={majorityNeeded.toString()}
                subtitle="Votes nécessaires (Quorum)"
              />
              <StatCard
                title="Total Membres"
                value={totalMembers.toString()}
                subtitle="Participants actifs"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Sidebar / Left Column */}
              <div className="lg:col-span-1 space-y-8">
                {/* User Info / Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Actions Rapides</h3>
                  <div className="space-y-4">
                    <CreateProposalDialog />
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={refresh}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Actualiser les données
                    </Button>
                  </div>
                </div>

                {/* Deposit Module */}
                <ExecutionPanel onDepositFunds={depositFunds} />

                {/* Admin Module (Owner Only) */}
                {isOwner && (
                  <AdminPanel
                    onAddMember={addMember}
                    onRemoveMember={removeMember}
                    onSetQuorum={setQuorum}
                    isConnected={true}
                  />
                )}
              </div>

              {/* Main Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Propositions Actives
                  </h2>
                  <Badge variant="outline" className="text-gray-500">
                    {proposals.length} Totales
                  </Badge>
                </div>

                <ProposalList />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Index Error:', error);
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white border border-red-200 rounded-lg p-6 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading App</h1>
          <pre className="text-sm text-red-600 overflow-auto bg-red-50 p-4 rounded">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    );
  }
};

export default Index;

import { Wallet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/hooks/useWeb3";
import { Badge } from "@/components/ui/badge";
import { CONTRACT_ADDRESS } from "@/constants/contract";

export const Header = () => {
  try {
    const {
      account,
      balance,
      isMember,
      isOwner,
      connectWallet,
      isConnecting,
      refresh
    } = useWeb3();

    // Si pas connecté
    if (!account) {
      return (
        <header className="border-b bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">SafeClub</h1>
                  <p className="text-sm text-gray-600">Trésorerie Décentralisée</p>
                </div>
              </div>

              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Connecter MetaMask
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>
      );
    }

    // Si connecté
    return (
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">SafeClub</h1>
                <p className="text-sm text-gray-600">Trésorerie Décentralisée</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={refresh}
                className="hidden sm:flex"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>

              <div className="text-right">
                <p className="text-xs text-gray-600">Votre wallet</p>
                <p className="text-sm font-mono font-semibold text-gray-800">
                  {account.substring(0, 6)}...{account.substring(38)}
                </p>
                <p className="text-[10px] text-gray-400 font-mono">
                  Contrat: {CONTRACT_ADDRESS.substring(0, 6)}...{CONTRACT_ADDRESS.substring(38)}
                </p>
                <p className="text-xs text-indigo-600 font-semibold">
                  {parseFloat(balance || '0').toFixed(4)} ETH
                </p>
              </div>

              <div className="flex gap-2">
                {isMember && (
                  <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-200">
                    ✓ Membre
                  </Badge>
                )}
                {isOwner && (
                  <Badge variant="default" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                    👑 Owner
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header Error:', error);
    return (
      <header className="border-b bg-red-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <p className="text-red-600 text-sm">Header Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </header>
    );
  }
};

import { useState } from "react";
import { Clock, CheckCircle, XCircle, Play, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useWeb3 } from "@/hooks/useWeb3";

export const ProposalList = () => {
  const {
    proposals,
    majorityNeeded,
    isMember,
    vote,
    executeProposal
  } = useWeb3();

  const [loadingProposal, setLoadingProposal] = useState<number | null>(null);

  const handleVote = async (proposalId: number, support: boolean) => {
    setLoadingProposal(proposalId);
    await vote(proposalId, support);
    setLoadingProposal(null);
  };

  const handleExecute = async (proposalId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir exécuter cette proposition ?")) {
      setLoadingProposal(proposalId);
      await executeProposal(proposalId);
      setLoadingProposal(null);
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = timestamp - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diff < 0) return "Terminé";
    if (days > 0) return `${days}j ${hours}h restantes`;
    return `${hours}h restantes`;
  };

  if (proposals.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-600 text-center">Aucune proposition pour le moment</p>
          <p className="text-sm text-gray-500 mt-2">Créez la première proposition pour démarrer!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => {
        const isActive = proposal.deadline > Date.now() && !proposal.executed;
        const hasMajority = proposal.votesFor >= majorityNeeded;
        const canExecute = !isActive && !proposal.executed && hasMajority;
        const progress = Math.min(100, (proposal.votesFor / majorityNeeded) * 100);
        const isLoading = loadingProposal === proposal.id;

        return (
          <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <CardTitle className="text-xl">{proposal.title}</CardTitle>

                    {proposal.executed && (
                      <Badge variant="default" className="bg-green-100 text-green-700">
                        ✓ Exécutée
                      </Badge>
                    )}
                    {!proposal.executed && !isActive && (
                      <Badge variant="secondary">
                        Expirée
                      </Badge>
                    )}
                    {isActive && (
                      <Badge variant="default" className="bg-blue-100 text-blue-700">
                        🔴 En cours
                      </Badge>
                    )}
                  </div>

                  <CardDescription className="text-sm">
                    {proposal.description}
                  </CardDescription>

                  <div className="flex items-center gap-6 mt-3 text-sm text-gray-600 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(proposal.deadline)}
                    </span>
                    <span className="font-semibold text-indigo-600">
                      {parseFloat(proposal.amount).toFixed(4)} ETH
                    </span>
                    <span className="font-mono text-xs">
                      → {proposal.recipient.substring(0, 10)}...
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Résultats du vote */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="flex items-center gap-1 text-green-600 font-semibold">
                    <CheckCircle className="w-4 h-4" /> Pour: {proposal.votesFor}
                  </span>
                  <span className="flex items-center gap-1 text-red-600 font-semibold">
                    <XCircle className="w-4 h-4" /> Contre: {proposal.votesAgainst}
                  </span>
                  <span className="text-gray-600">
                    Majorité: {majorityNeeded}
                  </span>
                </div>

                <Progress value={progress} className="h-2" />
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {isActive && isMember && !proposal.hasVoted && (
                  <>
                    <Button
                      onClick={() => handleVote(proposal.id, true)}
                      disabled={isLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      👍 Voter POUR
                    </Button>
                    <Button
                      onClick={() => handleVote(proposal.id, false)}
                      disabled={isLoading}
                      variant="destructive"
                      className="flex-1"
                    >
                      👎 Voter CONTRE
                    </Button>
                  </>
                )}

                {proposal.hasVoted && isActive && (
                  <div className="flex-1 text-center py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold">
                    ✓ Vous avez déjà voté
                  </div>
                )}

                {canExecute && isMember && (
                  <Button
                    onClick={() => handleExecute(proposal.id)}
                    disabled={isLoading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Exécuter la proposition
                  </Button>
                )}

                {!isActive && !proposal.executed && !hasMajority && (
                  <div className="flex-1 text-center py-2 bg-gray-50 text-gray-600 rounded-lg font-semibold">
                    ❌ Majorité non atteinte
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

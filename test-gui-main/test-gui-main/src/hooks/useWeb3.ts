import { useWeb3Context } from '../providers/Web3Provider';

export const useWeb3 = () => {
  return useWeb3Context();
};

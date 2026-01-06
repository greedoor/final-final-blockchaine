import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("SafeClub", function () {
  let safeClub;
  let owner;
  let member1;
  let member2;
  let nonMember;

  beforeEach(async function () {
    [owner, member1, member2, nonMember] = await ethers.getSigners();

    const SafeClub = await ethers.getContractFactory("SafeClub");
    safeClub = await SafeClub.deploy(2); // quorum of 2
    await safeClub.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await safeClub.owner()).to.equal(owner.address);
    });

    it("Should set the right quorum", async function () {
      expect(await safeClub.quorum()).to.equal(2);
    });

    it("Should add owner as initial member", async function () {
      expect(await safeClub.isMember(owner.address)).to.be.true;
      expect(await safeClub.getMemberCount()).to.equal(1);
    });
  });

  describe("Member Management", function () {
    it("Should allow owner to add a member", async function () {
      await expect(safeClub.addMember(member1.address))
        .to.emit(safeClub, "MemberAdded")
        .withArgs(member1.address);

      expect(await safeClub.isMember(member1.address)).to.be.true;
      expect(await safeClub.getMemberCount()).to.equal(2);
    });

    it("Should not allow non-owner to add a member", async function () {
      await expect(
        safeClub.connect(member1).addMember(member2.address)
      ).to.be.revertedWithCustomError(safeClub, "OwnableUnauthorizedAccount");
    });

    it("Should not allow adding zero address as member", async function () {
      await expect(
        safeClub.addMember(ethers.ZeroAddress)
      ).to.be.revertedWith("Adresse invalide");
    });

    it("Should not allow adding duplicate member", async function () {
      await safeClub.addMember(member1.address);
      await expect(
        safeClub.addMember(member1.address)
      ).to.be.revertedWith("Deja membre");
    });

    it("Should allow owner to remove a member", async function () {
      await safeClub.addMember(member1.address);
      await expect(safeClub.removeMember(member1.address))
        .to.emit(safeClub, "MemberRemoved")
        .withArgs(member1.address);

      expect(await safeClub.isMember(member1.address)).to.be.false;
      expect(await safeClub.getMemberCount()).to.equal(1);
    });

    it("Should not allow removing non-member", async function () {
      await expect(
        safeClub.removeMember(member1.address)
      ).to.be.revertedWith("Pas membre");
    });
  });

  describe("Proposals", function () {
    beforeEach(async function () {
      // Fund the contract
      await owner.sendTransaction({
        to: await safeClub.getAddress(),
        value: ethers.parseEther("10"),
      });
      await safeClub.addMember(member1.address);
      await safeClub.addMember(member2.address);
    });

    it("Should allow member to create a proposal", async function () {
      const amount = ethers.parseEther("5");
      const description = "Test proposal";
      const duration = 60;

      await expect(
        safeClub.connect(member1).createProposal(
          member2.address,
          amount,
          description,
          duration
        )
      )
        .to.emit(safeClub, "ProposalCreated");

      const proposal = await safeClub.getProposal(0);
      expect(proposal.recipient).to.equal(member2.address);
      expect(proposal.amount).to.equal(amount);
      expect(proposal.description).to.equal(description);
      expect(proposal.executed).to.be.false;
      // Check deadline is approximately correct (within 2 seconds)
      const blockAfter = await ethers.provider.getBlock("latest");
      expect(proposal.deadline).to.be.closeTo(blockAfter.timestamp + duration, 2);
    });

    it("Should not allow non-member to create proposal", async function () {
      await expect(
        safeClub.connect(nonMember).createProposal(
          member1.address,
          ethers.parseEther("1"),
          "Test",
          60
        )
      ).to.be.revertedWith("Seul un membre");
    });

    it("Should not allow proposal with zero amount", async function () {
      await expect(
        safeClub.connect(member1).createProposal(
          member2.address,
          0,
          "Test",
          60
        )
      ).to.be.revertedWith("Montant invalide");
    });

    it("Should not allow proposal with amount exceeding balance", async function () {
      await expect(
        safeClub.connect(member1).createProposal(
          member2.address,
          ethers.parseEther("20"),
          "Test",
          60
        )
      ).to.be.revertedWith("Solde insuffisant");
    });

    it("Should not allow proposal with zero address recipient", async function () {
      await expect(
        safeClub.connect(member1).createProposal(
          ethers.ZeroAddress,
          ethers.parseEther("1"),
          "Test",
          60
        )
      ).to.be.revertedWith("Destinataire invalide");
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      await owner.sendTransaction({
        to: await safeClub.getAddress(),
        value: ethers.parseEther("10"),
      });
      await safeClub.addMember(member1.address);
      await safeClub.addMember(member2.address);

      await safeClub.connect(member1).createProposal(
        member2.address,
        ethers.parseEther("5"),
        "Test proposal",
        60
      );
    });

    it("Should allow member to vote yes", async function () {
      await expect(safeClub.connect(member1).vote(0, true))
        .to.emit(safeClub, "Voted")
        .withArgs(0, member1.address, true);

      const proposal = await safeClub.getProposal(0);
      expect(proposal.yesVotes).to.equal(1);
      expect(proposal.noVotes).to.equal(0);
      expect(await safeClub.hasVoted(0, member1.address)).to.be.true;
    });

    it("Should allow member to vote no", async function () {
      await expect(safeClub.connect(member1).vote(0, false))
        .to.emit(safeClub, "Voted")
        .withArgs(0, member1.address, false);

      const proposal = await safeClub.getProposal(0);
      expect(proposal.yesVotes).to.equal(0);
      expect(proposal.noVotes).to.equal(1);
    });

    it("Should not allow non-member to vote", async function () {
      await expect(
        safeClub.connect(nonMember).vote(0, true)
      ).to.be.revertedWith("Seul un membre");
    });

    it("Should not allow double voting", async function () {
      await safeClub.connect(member1).vote(0, true);
      await expect(
        safeClub.connect(member1).vote(0, true)
      ).to.be.revertedWith("Deja vote");
    });

    it("Should not allow voting after deadline", async function () {
      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [61]);
      await ethers.provider.send("evm_mine", []);

      await expect(
        safeClub.connect(member1).vote(0, true)
      ).to.be.revertedWith("Vote termine");
    });
  });

  describe("Proposal Execution", function () {
    beforeEach(async function () {
      await owner.sendTransaction({
        to: await safeClub.getAddress(),
        value: ethers.parseEther("10"),
      });
      await safeClub.addMember(member1.address);
      await safeClub.addMember(member2.address);

      await safeClub.connect(member1).createProposal(
        member2.address,
        ethers.parseEther("5"),
        "Test proposal",
        60
      );
    });

    it("Should execute proposal when quorum and majority are met", async function () {
      // Vote yes by both members
      await safeClub.connect(member1).vote(0, true);
      await safeClub.connect(member2).vote(0, true);

      // Fast forward past deadline
      await ethers.provider.send("evm_increaseTime", [61]);
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await ethers.provider.getBalance(member2.address);
      
      await expect(safeClub.executeProposal(0))
        .to.emit(safeClub, "ProposalExecuted")
        .withArgs(0, member2.address, ethers.parseEther("5"));

      const proposal = await safeClub.getProposal(0);
      expect(proposal.executed).to.be.true;

      const finalBalance = await ethers.provider.getBalance(member2.address);
      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("5"));
    });

    it("Should not execute proposal before deadline", async function () {
      await safeClub.connect(member1).vote(0, true);
      await safeClub.connect(member2).vote(0, true);

      await expect(
        safeClub.executeProposal(0)
      ).to.be.revertedWith("Vote encore en cours");
    });

    it("Should not execute proposal without quorum", async function () {
      // Only one vote (need 2 for quorum)
      await safeClub.connect(member1).vote(0, true);

      await ethers.provider.send("evm_increaseTime", [61]);
      await ethers.provider.send("evm_mine", []);

      await expect(
        safeClub.executeProposal(0)
      ).to.be.revertedWith("Quorum non atteint");
    });

    it("Should not execute proposal without majority", async function () {
      // Temporarily set quorum to 1 to test majority check
      await safeClub.setQuorum(1);
      
      // Create a new proposal with lower quorum
      await safeClub.connect(member1).createProposal(
        member2.address,
        ethers.parseEther("2"),
        "Test proposal 2",
        60
      );

      // Vote: 1 yes, 2 no (meets quorum of 1, but no majority)
      await safeClub.connect(member1).vote(1, true);
      await safeClub.connect(member2).vote(1, false);
      await safeClub.connect(owner).vote(1, false);

      await ethers.provider.send("evm_increaseTime", [61]);
      await ethers.provider.send("evm_mine", []);

      await expect(
        safeClub.executeProposal(1)
      ).to.be.revertedWith("Majorite non atteinte");
    });

    it("Should not execute already executed proposal", async function () {
      await safeClub.connect(member1).vote(0, true);
      await safeClub.connect(member2).vote(0, true);

      await ethers.provider.send("evm_increaseTime", [61]);
      await ethers.provider.send("evm_mine", []);

      await safeClub.executeProposal(0);

      await expect(
        safeClub.executeProposal(0)
      ).to.be.revertedWith("Deja executee");
    });
  });

  describe("Quorum Management", function () {
    it("Should allow owner to change quorum", async function () {
      await safeClub.setQuorum(3);
      expect(await safeClub.quorum()).to.equal(3);
    });

    it("Should not allow zero quorum", async function () {
      await expect(
        safeClub.setQuorum(0)
      ).to.be.revertedWith("Quorum invalide");
    });

    it("Should not allow non-owner to change quorum", async function () {
      await expect(
        safeClub.connect(member1).setQuorum(3)
      ).to.be.revertedWithCustomError(safeClub, "OwnableUnauthorizedAccount");
    });
  });

  describe("Utilities", function () {
    it("Should return correct balance", async function () {
      const amount = ethers.parseEther("5");
      await owner.sendTransaction({
        to: await safeClub.getAddress(),
        value: amount,
      });

      expect(await safeClub.getBalance()).to.equal(amount);
    });

    it("Should accept ether via receive function", async function () {
      const amount = ethers.parseEther("3");
      await owner.sendTransaction({
        to: await safeClub.getAddress(),
        value: amount,
      });

      expect(await safeClub.getBalance()).to.equal(amount);
    });
  });
});

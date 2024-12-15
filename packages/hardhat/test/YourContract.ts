import { ethers } from "hardhat";

import { expect } from "chai";

describe("CopyrightRegistry", function () {
  let copyrightRegistry: any;
  let owner: any;
  let otherAccount: any;
  const contentHash = "hash123";

  beforeEach(async function () {
    // Разворачиваем контракт перед каждым тестом
    [owner, otherAccount] = await ethers.getSigners();
    const CopyrightRegistry = await ethers.getContractFactory("CopyrightRegistry");
    copyrightRegistry = await CopyrightRegistry.deploy();
  });

  it("Should register content successfully", async function () {
    // Регистрируем контент
    const tx = await copyrightRegistry.registerContent(contentHash);
    await tx.wait();

    // Проверяем, что контент зарегистрирован
    const registeredContent = await copyrightRegistry.verifyContent(contentHash);
    expect(registeredContent.author).to.equal(owner.address);
    expect(registeredContent.timestamp).to.be.a("bigint");
  });

  it("Should not allow duplicate content registration", async function () {
    await copyrightRegistry.registerContent(contentHash);
    await expect(copyrightRegistry.registerContent(contentHash)).to.be.revertedWith("Content already registered");
  });

  it("Should return the correct content owner", async function () {
    await copyrightRegistry.registerContent(contentHash);
    const ownerAddress = await copyrightRegistry.getContentOwner(contentHash);
    expect(ownerAddress).to.equal(owner.address);
  });

  it("Should revert when getting owner of unregistered content", async function () {
    await expect(copyrightRegistry.getContentOwner("unregisteredHash")).to.be.revertedWith("Content not registered");
  });

  it("Should transfer ownership of content", async function () {
    await copyrightRegistry.registerContent(contentHash);

    // Передаем владение другому аккаунту
    const tx = await copyrightRegistry.transferOwnership(contentHash, otherAccount.address);
    await tx.wait();

    // Проверяем, что новый владелец установлен
    const newOwner = await copyrightRegistry.getContentOwner(contentHash);
    expect(newOwner).to.equal(otherAccount.address);
  });

  it("Should revert if non-owner tries to transfer ownership", async function () {
    await copyrightRegistry.registerContent(contentHash);

    await expect(
      copyrightRegistry.connect(otherAccount).transferOwnership(contentHash, otherAccount.address),
    ).to.be.revertedWith("Only the current owner can transfer ownership");
  });

  it("Should revert if transferring ownership to zero address", async function () {
    await copyrightRegistry.registerContent(contentHash);

    await expect(copyrightRegistry.transferOwnership(contentHash, ethers.ZeroAddress)).to.be.revertedWith(
      "New owner cannot be the zero address",
    );
  });

  it("Should revert if registering empty content hash", async function () {
    await expect(copyrightRegistry.registerContent("")).to.be.revertedWith("Content hash cannot be empty");
  });

  it("Should revert if verifying empty content hash", async function () {
    await expect(copyrightRegistry.verifyContent("")).to.be.revertedWith("Content hash cannot be empty");
  });

  it("Should revert if verifying unregistered content", async function () {
    await expect(copyrightRegistry.verifyContent("unregisteredHash")).to.be.revertedWith("Content not registered");
  });
});

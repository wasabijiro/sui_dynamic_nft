module nft::dev_nft {
    use sui::url::{Self, Url};
    use std::string;
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    /// An example NFT that can be minted by anybody
    struct TestNetNFT has key, store {
        id: UID,
        /// Name for the token
        name: string::String,
        /// Description of the token
        description: string::String,
        /// URL for the token
        url: Url,
        color_r: u8,
        color_g: u8,
        color_b: u8,
    }

    // ===== Events =====

    struct NFTMinted has copy, drop {
        // The Object ID of the NFT
        object_id: ID,
        // The creator of the NFT
        creator: address,
        // The name of the NFT
        name: string::String,
    }

    // ===== Public view functions =====

    /// Get the NFT's `name`
    public fun name(nft: &TestNetNFT): &string::String {
        &nft.name
    }

    /// Get the NFT's `description`
    public fun description(nft: &TestNetNFT): &string::String {
        &nft.description
    }

    /// Get the NFT's `url`
    public fun url(nft: &TestNetNFT): &Url {
        &nft.url
    }

    // ===== Entrypoints =====

    /// Create a new testnet_nft
    public entry fun mint_to_sender(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let nft = TestNetNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url),
            color_r: 0,
            color_g: 0,
            color_b: 0,
        };

        event::emit(NFTMinted {
            object_id: object::id(&nft),
            creator: sender,
            name: nft.name,
        });

        transfer::public_transfer(nft, sender);
    }

    /// Transfer `nft` to `recipient`
    public entry fun transfer(
        nft: TestNetNFT, recipient: address, _: &mut TxContext
    ) {
        transfer::public_transfer(nft, recipient)
    }

    /// Update the `description` of `nft` to `new_description`
    public entry fun update_description(
        nft: &mut TestNetNFT,
        new_description: vector<u8>,
        _: &mut TxContext
    ) {
        nft.description = string::utf8(new_description)
    }

    public entry fun update_color_r(
        nft: &mut TestNetNFT,
        new_r: u8,
        _: &mut TxContext
    ) {
        nft.color_r = new_r
    }

    public entry fun update_color_g(
        nft: &mut TestNetNFT,
        new_g: u8,
        _: &mut TxContext
    ) {
        nft.color_g = new_g
    }

    public entry fun update_color_b(
        nft: &mut TestNetNFT,
        new_b: u8,
        _: &mut TxContext
    ) {
        nft.color_b = new_b
    }

    /// Permanently delete `nft`
    public entry fun burn(nft: TestNetNFT, _: &mut TxContext) {
        let TestNetNFT { id, name: _, description: _, url: _, color_r: _, color_g: _, color_b: _, } = nft;
        object::delete(id)
    }
}

#[test_only]
module nft::dev_nftTests {
    use nft::dev_nft::{Self, TestNetNFT};
    use sui::test_scenario as ts;
    use sui::transfer;
    use std::string;

    #[test]
    fun mint_transfer_update() {
        let addr1 = @0xA;
        let addr2 = @0xB;
        // create the NFT
        let scenario = ts::begin(addr1);

        {
            dev_nft::mint_to_sender(
                b"test",
                b"a test",
                b"https://www.sui.io",
                ts::ctx(&mut scenario)
            )
        };
        // send it from A to B
        ts::next_tx(&mut scenario, addr1);
        {
            let nft = ts::take_from_sender<TestNetNFT>(&mut scenario);
            transfer::public_transfer(nft, addr2);
        };
        // update its description
        ts::next_tx(&mut scenario, addr2);
        {
            let nft = ts::take_from_sender<TestNetNFT>(&mut scenario);
            dev_nft::update_description(&mut nft, b"a new description", ts::ctx(&mut scenario));
            assert!(*string::bytes(dev_nft::description(&nft)) == b"a new description", 0);
            ts::return_to_sender(&mut scenario, nft);
        };
        // burn it
        ts::next_tx(&mut scenario, addr2);
        {
            let nft = ts::take_from_sender<TestNetNFT>(&mut scenario);
            dev_nft::burn(nft, ts::ctx(&mut scenario))
        };
        ts::end(scenario);
    }
}
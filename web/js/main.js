        $( document ).ready(function() {
            
            /* FUNCS */
            
            async function main() {

                client = new xrpl.Client("wss://s.altnet.rippletest.net/");
                await client.connect();

                if( client.isConnected() ){

                    $("#led-network").removeClass("notconnect");
                    $(".net-selector").html("XRPL Testnet");

                }else{

                    $("#led-network").addClass("notconnect");
                    $(".net-selector").html("Offline");

                }

            }
            
            async function GenNewAdd(){

                let wallet = await xrpl.Wallet.generate();
                
                $(".na-02").append('<h3>Address</h3><div class="form-box"><input type="text" name="new-address" value="' + wallet.address + '" placeholder="Wallet Address"></div>');
                $(".na-02").append('<h3>Private Key</h3><div class="form-box"><input type="text" name="new-pvkey" value="' + wallet.privateKey + '" placeholder="Private Key"></div>');
                $(".na-02").append('<h3>Public Key</h3><div class="form-box"><input type="text" name="new-ppkey" value="' + wallet.publicKey + '" placeholder="Public Key"></div>');
                $(".na-02").append('<h3>Seed Phrase</h3><div class="form-box"><input type="text" name="new-seed" value="' + wallet.seed + '" placeholder="Secret Seed"></div>');

            }
            
            async function AccessSeed(){
                
                var seed = $.trim( $("#input-seed").val() );
                var wallet = await xrpl.Wallet.fromSeed( seed );
                
                /*
                var wallet_balances = await client.request({
                    command: "account_info",
                    account: wallet.address,
                    strict: true,
                    ledger_index: "current",
                    queue: true
                });
                
                var wallet_balance = await client.getXrpBalance( wallet.address ); */
                
                $(".as-02").fadeIn(300,function(){
                    
                    $(".current-address").html( wallet.address );
                    $(".current-xrp-balance span").html("0");
                    
                });
                
            }

             main();
            
            /* EVENTS */

            $(document).on("click","#xonic-access",function(){

                $(".access-box").fadeOut(333,function(){

                    $("#input-seed").val("");
                    $("#xonic-access-seed").prop("disabled",false);
                    $(".sa-01").show();
                    $(".sa-02").hide().html("");
                    $(".access-seed").fadeIn(); 

                });

            });

            $(document).on("click","#xonic-newaddress",function(){

                $(".access-box").fadeOut(333,function(){
                    
                    $("#xonic-newaddress-confirm").prop("disabled",false);
                    $(".na-01").show();
                    $(".na-02").hide().html("");
                    $(".access-newaddress").fadeIn(); 

                });

            });

            $(document).on("click","#xonic-main",function(){

                $(".xonic-box").hide(1,function(){

                    $(".current-address").html("");
                    $(".current-xrp-balance span").html("");
                    $(".as-01").show();
                    $(".as-02").hide();
                    $(".access-box").fadeIn(333);

                });

            });
            
            $(document).on("click","#xonic-access-seed",function(e){

                e.stopPropagation;
                $(this).prop("disabled",true);
                $(".as-01").hide();
                AccessSeed();

            });

            $(document).on("click","#xonic-newaddress-confirm",function(e){

                e.stopPropagation;
                $(this).prop("disabled",true);
                $(".na-02").fadeIn(300,function(){
                    
                    $(".na-01").hide();
                    GenNewAdd();

                });

            });
            
        });
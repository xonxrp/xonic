        $( document ).ready(function() {
            
            /* INIT */
            $(".xonic-box").hide();
            
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
                
                if( sessionStorage.getItem("wallet") ) {
                    
                    $("#led-wallet").removeClass("notconnect");
                    $(".access-box").hide();
                    $(".wallet-recap").fadeIn(333,function(){

                        $(".current-address").html( sessionStorage.getItem("wallet") );
                        $(".current-xrp-balance span").html("0");

                    });
                    
                }else{
                    
                    $(".access-box").fadeIn(333);
                    
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
                
                // success
                $("#led-wallet").removeClass("notconnect");
                $(".xonic-box").hide();
                $(".wallet-recap").fadeIn(300,function(){
                    
                    sessionStorage.setItem("seed", seed );
                    sessionStorage.setItem("wallet", wallet.address );
                    
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
            
            $(document).on("click","#btn-disconnect-wallet",function(e){
                
                sessionStorage.removeItem('seed');
                sessionStorage.removeItem('wallet');
                $("#led-wallet").addClass("notconnect");
                $(".xonic-box").hide(1,function(){ $(".access-box").fadeIn(333); });
                
            });
            
        });
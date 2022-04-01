        $( document ).ready(function() {
            
            /* INIT */
            main();
            
            /* FUNCS */
            async function main() {
                
                api = new xrpl.Client('wss://s.altnet.rippletest.net');
                await api.connect();
                
                api.on('error', (errorCode, errorMessage) => {
                    console.log(errorCode + ': ' + errorMessage);
                });
                
                if( api.isConnected() ){

                    $("#led-network").removeClass("notconnect");
                    $(".net-selector").html("XRPL Testnet");
                    
                    if( sessionStorage.getItem("wallet") ) {
                        
                        $("#led-wallet").removeClass("notconnect");
                        $(".box-wallet-access").hide();
                        $(".wallet-recap").fadeIn(333,async function(){
                                                        
                                let response = await api.request({
                                    "command": "account_info",
                                    "account": sessionStorage.getItem("wallet")
                                });

                                $(".current-address").html( response.result.account_data.Account );
                                $(".current-xrp-balance span").html( xrpl.dropsToXrp( response.result.account_data.Balance ) );

                        });
                        
                    }else{
                        
                        $(".box-wallet-access").fadeIn(300);
                        
                    }

                }else{

                    $("#led-network").addClass("notconnect");
                    $(".net-selector").html("Offline");

                }
            }
            
            async function GenNewAdd(){
                
                $(".backto-main").hide();
                $(".na-02").html('Generating...<BR>');

                let wallet = await xrpl.Wallet.generate();
                
                $(".na-02").html('Funding for Test Net...<BR>');
                
                let response = await api.fundWallet( wallet );
                
                $(".na-02").html('');
                
                $(".na-02").append('<h3>Address</h3><div class="form-box"><input type="text" name="new-address" value="' + wallet.address + '" placeholder="Wallet Address"></div>');
                $(".na-02").append('<h3>Private Key</h3><div class="form-box"><input type="text" name="new-pvkey" value="' + wallet.privateKey + '" placeholder="Private Key"></div>');
                $(".na-02").append('<h3>Public Key</h3><div class="form-box"><input type="text" name="new-ppkey" value="' + wallet.publicKey + '" placeholder="Public Key"></div>');
                $(".na-02").append('<h3>Seed Phrase</h3><div class="form-box"><input type="text" name="new-seed" value="' + wallet.seed + '" placeholder="Secret Seed"></div>');
                
                $(".backto-main").show();
                
            }
            
            async function AccessSeed(){
                
                var seed = $.trim( $("#input-seed").val() );
                var wallet = await xrpl.Wallet.fromSeed( seed );
                
                $("#led-wallet").removeClass("notconnect");
                $(".xonic-box").hide();
                $(".wallet-recap").fadeIn(300,async function(){
                    
                    sessionStorage.setItem("seed", seed );
                    sessionStorage.setItem("wallet", wallet.address );
                    
                    let response = await api.request({
                        "command": "account_info",
                        "account": sessionStorage.getItem("wallet")
                    });
                    
                    sessionStorage.setItem("balance", response.result.account_data.Balance );

                    $(".current-address").html( response.result.account_data.Account );
                    $(".current-xrp-balance span").html( xrpl.dropsToXrp( response.result.account_data.Balance ) );

                    
                });
                
            }

            /* EVENTS */

            $(document).on("click","#xonic-access",function(){

                $(".box-wallet-access").fadeOut(333,function(){

                    $(".backto-main").show(); 
                    $("#input-seed").val("");
                    $("#xonic-access-seed").prop("disabled",false);
                    $(".sa-01").show();
                    $(".access-seed").fadeIn(); 

                });

            });

            $(document).on("click","#xonic-newaddress",function(){

                $(".box-wallet-access").fadeOut(333,function(){
                    
                    $(".backto-main").show(); 
                    $("#xonic-newaddress-confirm").prop("disabled",false);
                    $(".na-01").show();
                    $(".na-02").hide().html("");
                    $(".access-newaddress").fadeIn(); 

                });

            });

            $(document).on("click",".backto-main",function(){

                $(".xonic-box").hide(1,function(){

                    $(".current-address").html("");
                    $(".current-xrp-balance span").html("");
                    $(".as-01").show();
                    $(".as-02").hide();
                    $(".box-wallet-access").fadeIn(333);

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
                $(".xonic-box").hide(1,function(){ $(".box-wallet-access").fadeIn(333); });
                
            });
            
        });
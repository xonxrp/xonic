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
                        $(".box-wallet-recap").fadeIn(333,async function(){
                                                        
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
                
                $(".btn-backto-main").hide();
                $(".na-02").html('').append('Generating...<BR>');

                let wallet = await xrpl.Wallet.generate();
                
                $(".na-02").append('Funding for Test Net...<BR>');
                
                let response = await api.fundWallet( wallet );
                
                $(".na-02").html('');
                
                $(".na-02").append('<h3>Address</h3><div class="form-box"><input type="text" name="new-address" value="' + wallet.address + '" placeholder="Wallet Address"></div>');
                $(".na-02").append('<h3>Private Key</h3><div class="form-box"><input type="text" name="new-pvkey" value="' + wallet.privateKey + '" placeholder="Private Key"></div>');
                $(".na-02").append('<h3>Public Key</h3><div class="form-box"><input type="text" name="new-ppkey" value="' + wallet.publicKey + '" placeholder="Public Key"></div>');
                $(".na-02").append('<h3>Seed Phrase</h3><div class="form-box"><input type="text" name="new-seed" value="' + wallet.seed + '" placeholder="Secret Seed"></div>');
                
                $(".btn-backto-main").show();
                
            }
            
            async function AccessSeed(){
                
                var seed = $.trim( $("#input-seed").val() );
                    if( seed.length < 6 ){ return false; }
                
                try{ var wallet = await xrpl.Wallet.fromSeed( seed ); }
                catch(error){ 
                    
                    console.log(error.message);
                    alert(error.message);
                    return false;
                
                }

                $("#led-wallet").removeClass("notconnect");
                $(".xonic-box").hide();
                $(".box-wallet-recap").fadeIn(300,async function(){
                    
                    sessionStorage.setItem("seed", seed );
                    sessionStorage.setItem("wallet", wallet.address );
                    
                    try{
                        
                        var response = await api.request({
                            "command": "account_info",
                            "account": sessionStorage.getItem("wallet")
                        })
                        
                    }
                    catch(error){ 

                        console.log(error.message);
                        alert(error.message);
                        return false;

                    }
                    
                    sessionStorage.setItem("balance", response.result.account_data.Balance );

                    $(".current-address").html( response.result.account_data.Account );
                    $(".current-xrp-balance span").html( xrpl.dropsToXrp( response.result.account_data.Balance ) );

                    
                });
                
            }

            /* EVENTS */

            $(document).on("click","#btn-access",function(){

                $(".box-wallet-access").fadeOut(333,function(){

                    $(".btn-backto-main").show(); 
                    $("#input-seed").val("");
                    $(".sa-01").show();
                    $(".box-access-seed").fadeIn(); 

                });

            });

            $(document).on("click","#btn-newaddress",function(){

                $(".box-wallet-access").fadeOut(333,function(){
                    
                    $(".btn-backto-main").show(); 
                    $(".na-01").show();
                    $(".na-02").hide().html("");
                    $(".box-access-newaddress").fadeIn(); 

                });

            });

            $(document).on("click",".btn-backto-main",function(){

                $(".xonic-box").hide(0,function(){

                    $(".current-address").html("");
                    $(".current-xrp-balance span").html("");
                    $(".as-01").show();
                    $(".as-02").hide();
                    $(".box-wallet-access").fadeIn(333);

                });

            });
            
            $(document).on("click","#btn-access-seed",function(e){

                e.stopPropagation;
                AccessSeed();

            });

            $(document).on("click","#btn-newaddress-confirm",function(e){

                e.stopPropagation;
                
                $(".na-02").fadeIn(300,function(){
                    
                    $(".na-01").hide();
                    GenNewAdd();

                });

            });
            
            $(document).on("click","#btn-disconnect-wallet",function(e){
                
                sessionStorage.removeItem('seed');
                sessionStorage.removeItem('wallet');
                $("#led-wallet").addClass("notconnect");
                $(".xonic-box").hide(0,function(){ $(".box-wallet-access").fadeIn(333); });
                
            });
            
            $(document).on("click","#send-tx",function(e){
                
                $(".wr-03").hide(0,function(){ $(".wr-04").show(); });
                
            });
            
            $(document).on("click","#take-tx",function(e){
                
                $(".wr-03").hide(0,function(){ $("#qrcode").html(""); $("#qrcode").qrcode( sessionStorage.getItem("wallet") ); $(".wr-05").show(); });
                
            });
            
            $(document).on("click",".cancel-tx",function(e){
                
                $(this).parent(".inner-view").hide();
                $(".wr-03").show();
                
            });
            
            $(document).on("click","#confirm-tx",function(e){
                
                alert("not implemented yet");
                
            });
            
        });
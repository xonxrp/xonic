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
                        $("#view-04,#view-05").show();
                        $(".box-wallet-recap").fadeIn(333,async function(){
                                                        
                                let response = await api.request({
                                    "command": "account_info",
                                    "account": sessionStorage.getItem("wallet")
                                });

                                $(".current-address").html( response.result.account_data.Account );
                                $(".current-xrp-balance span").html( xrpl.dropsToXrp( response.result.account_data.Balance ) );

                        });
                        
                    }else{
                        
                        $("#view-01").show();
                        $(".box-wallet-access").fadeIn(300);
                        
                    }

                }else{

                    $("#led-network").addClass("notconnect");
                    $(".net-selector").html("Offline");

                }
            }
            
            async function GenNewAdd(){
                
                $("#view-09").html('<div class="view-dialog cx"></div>')
                $("#view-09 .view-dialog").append('Generating...<BR>');

                let wallet = await xrpl.Wallet.generate();
                
                $("#view-09 .view-dialog").append('Funding for Test Net...<BR>');
                
                let response = await api.fundWallet( wallet );
                
                $("#view-09").html('<div class="view-dialog cx"></div>');
                
                $("#view-09 .view-dialog").append('<h3>Address</h3><div class="form-box"><input type="text" name="new-address" value="' + wallet.address + '" placeholder="Wallet Address"></div>');
                $("#view-09 .view-dialog").append('<h3>Private Key</h3><div class="form-box"><input type="text" name="new-pvkey" value="' + wallet.privateKey + '" placeholder="Private Key"></div>');
                $("#view-09 .view-dialog").append('<h3>Public Key</h3><div class="form-box"><input type="text" name="new-ppkey" value="' + wallet.publicKey + '" placeholder="Public Key"></div>');
                $("#view-09 .view-dialog").append('<h3>Secret Seed</h3><div class="form-box"><input type="text" name="new-seed" value="' + wallet.seed + '" placeholder="Secret Seed"></div>');
                
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
                    $("#view-04").show(0,function(){ $("#view-05,#btn-disconnect-wallet").fadeIn(300); });
                    
                });
                
            }
            
            async function SendXRP(){
                
                let amount_xrp = $("#payment-qt").val();
                let destination_add = $("#to-address").val();

                const prepared = await client.autofill({
                    "TransactionType": "Payment",
                    "Account": wallet.address,
                    "Amount": xrpl.xrpToDrops(amount_xrp),
                    "Destination": destination_add
                });
                
                const max_ledger = prepared.LastLedgerSequence;
                console.log("Prepared transaction instructions:", prepared);
                console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP");
                console.log("Transaction expires after ledger:", max_ledger);

                const signed = wallet.sign(prepared);
                console.log("Identifying hash:", signed.hash);
                console.log("Signed blob:", signed.tx_blob);

                
            }

            /* EVENTS */

            $(document).on("click","#btn-access",function(){

                $(".box-wallet-access").fadeOut(333,function(){

                    $(".btn-backto-main").show(); 
                    $("#input-seed").val("");
                    $("#view-02").show();
                    $(".box-access-seed").fadeIn(); 

                });

            });

            $(document).on("click","#btn-newaddress",function(){

                $(".box-wallet-access").fadeOut(333,function(){
                    
                    $(".btn-backto-main").show(); 
                    $("#view-03").show();
                    $("#view-09").hide().html("");
                    $(".box-access-newaddress").fadeIn(); 

                });

            });

            $(document).on("click",".btn-backto-main",function(){

                $(".xonic-box").hide(0,function(){

                    $(".current-address").html("");
                    $(".current-xrp-balance span").html("");
                    $(".inner-view").hide();
                    $("#view-01").show();
                    $(".box-wallet-access").fadeIn(333);

                });

            });
            
            $(document).on("click","#btn-access-seed",function(e){

                e.stopPropagation;
                $("#btn-disconnect-wallet").hide();
                AccessSeed();

            });

            $(document).on("click","#btn-newaddress-confirm",function(e){

                e.stopPropagation;
                
                $(".inner-view,.btn-backto-main").hide();
                $("#view-09").fadeIn(300,function(){
                    
                    GenNewAdd();

                });

            });
            
            $(document).on("click","#btn-disconnect-wallet",function(e){
                
                sessionStorage.removeItem('seed');
                sessionStorage.removeItem('wallet');
                $("#led-wallet").addClass("notconnect");
                $(".xonic-box").hide(0,function(){ $("#view-01").show(); $(".box-wallet-access").fadeIn(333); });
                
            });
            
            $(document).on("click","#give-tx",function(e){
                
                $("#payment-qt").val("");
                $("#to-address").val("");
                $("#view-04,#view-05").hide(0,function(){ $("#view-06").show(); });
                
            });
            
            $(document).on("click","#take-tx",function(e){
                
                $("#view-04,#view-05").hide(0,function(){ $("#qrcode").html(""); 
                $("#qrcode").qrcode( sessionStorage.getItem("wallet") );
                $("#view-07").show(); });
                
            });
            
            $(document).on("click",".cancel-tx",function(e){
                
                $(this).parent(".inner-view").hide();
                $("#view-04,#view-05").show();
                
            });
            
            $(document).on("click",".cancel-sign",function(e){
                
                $(this).parent(".inner-view").hide();
                $("#view-04,#view-05").show();
                
            });
            
            $(document).on("click","#confirm-tx",function(e){
                
                let amount_xrp = $("#payment-qt").val();
                let destination_add = $("#to-address").val();
                
                if( amount_xrp.length == "" ){ $("#payment-qt").focus(); return false; }
                if( destination_add.length == "" ){ $("#to-address").focus(); return false; }
                
                $(".tx-amount span").html( amount_xrp );
                $(".ad-destination").html( destination_add );
                
                $(this).parent(".inner-view").hide();
                $("#view-08").show();
                
            });
            
            $(document).on("click","#sign-tx",function(e){
                
                alert("not implemented");
                
            });
            
        });
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Copy,
  Check,
  ArrowUpRight,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Payment = ({ isOpen, onClose }) => {
  const [copiedAddress, setCopiedAddress] = useState(null);
  const navigate = useNavigate();

  const cryptoDetails = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      address: '1A1z7agoat91xZgVn5HCaxLUpG5zTCNjhX',
      mark: '₿',
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f42bE5',
      mark: 'Ξ',
    },
    {
      name: 'Solana',
      symbol: 'SOL',
      address: 'ATokenkLvnwEmCh7UsLccjZawn7S6GVZxksrx6oTKk9w',
      mark: 'S',
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      mark: '$',
    },
  ];

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedAddress(id);

      setTimeout(() => {
        setCopiedAddress(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const closePayment = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  return (
    <AnimatePresence>
      {(isOpen === undefined || isOpen) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePayment}
          className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-[#261b3d]/35 p-3 backdrop-blur-xl sm:p-6"
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.97,
            }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#faf9ff] shadow-[0_35px_120px_rgba(42,25,70,0.25)]"
          >
            {/* ================================================= */}
            {/* TOP PURPLE ACCENT */}
            {/* ================================================= */}

            <div className="h-1 w-full bg-gradient-to-r from-[#7658c9] via-[#9b7ade] to-[#c1b0ef]" />

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="border-b border-[#e7e1f2] bg-white/90 px-6 py-5 backdrop-blur-xl sm:px-9">
              <div className="relative flex items-start justify-between gap-6">
                <div className="flex flex-col items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0ebff] text-[#7658c9]">
                    <Wallet size={18} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#7658c9]" />

                      <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#8068b2]">
                        Secure payment
                      </span>
                    </div>

                    <h2 className="mt-3 gap-1 text-2xl font-semibold tracking-[-0.045em] text-[#2c233d] sm:text-4xl">
                      Cryptocurrency
                      <span className="ml-2 font-serif font-light italic text-[#8065bc]">
                        payment
                      </span>
                    </h2>

                    <p className="mt-3 text-sm leading-5 w-full text-[#776d82]">
                      Select your preferred cryptocurrency and send your
                      payment to the corresponding wallet address.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closePayment}
                  aria-label="Close payment"
                  className="group absolute top-2 right-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e5def2] bg-[#faf9ff] text-[#6e6081] transition-all duration-300 hover:border-[#bca9e8] hover:bg-[#f2edff] hover:text-[#7658c9]"
                >
                  <X
                    size={17}
                    className="transition-transform duration-300 group-hover:rotate-90"
                  />
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#eee9f5] pt-5">
                <span className="text-[8px] font-medium uppercase tracking-[0.25em] text-[#a49aad]">
                  Accepted currencies
                </span>

                <div className="flex items-center gap-2">
                  {['BTC', 'ETH', 'SOL', 'USDC'].map((symbol) => (
                    <span
                      key={symbol}
                      className="rounded-full border border-[#e4dcf2] bg-[#faf8ff] px-3 py-1.5 text-[8px] font-semibold tracking-[0.15em] text-[#765ba9]"
                    >
                      {symbol}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* CONTENT */}
            {/* ================================================= */}

            <div className="overflow-y-auto px-6 py-6 sm:px-9 sm:py-8">
              <div className="grid gap-4 md:grid-cols-2">
                {cryptoDetails.map((crypto, index) => {
                  const isCopied =
                    copiedAddress === crypto.symbol;

                  return (
                    <motion.div
                      key={crypto.symbol}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.08,
                        duration: 0.45,
                      }}
                      className="group rounded-2xl border border-[#e4ddf1] bg-white p-5 shadow-[0_10px_35px_rgba(76,55,125,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c4b3e9] hover:shadow-[0_18px_45px_rgba(76,55,125,0.09)] sm:p-6"
                    >
                      {/* CARD HEADER */}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e1d8f1] bg-[#f5f1ff] font-serif text-xl text-[#634b99]">
                            {crypto.mark}
                          </div>

                          <div>
                            <h3 className="text-base font-semibold tracking-[-0.02em] text-[#30253f]">
                              {crypto.name}
                            </h3>

                            <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.22em] text-[#a29aac]">
                              {crypto.symbol} network
                            </p>
                          </div>
                        </div>

                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f0fc] text-[8px] font-semibold text-[#856bb7]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* WALLET ADDRESS */}

                      <div className="mt-5 rounded-xl border border-[#e7e1f1] bg-[#faf9fd] p-3">
                        <div className="flex items-center gap-3">
                          <code className="min-w-0 flex-1 break-all font-mono text-[9px] leading-5 text-[#665b72] sm:text-[10px]">
                            {crypto.address}
                          </code>

                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                crypto.address,
                                crypto.symbol
                              )
                            }
                            aria-label={`Copy ${crypto.name} wallet address`}
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${
                              isCopied
                                ? 'border-[#7658c9] bg-[#7658c9] text-white'
                                : 'border-[#ded5ed] bg-white text-[#6d5a91] hover:border-[#b9a7e5] hover:bg-[#f3effc] hover:text-[#7658c9]'
                            }`}
                          >
                            {isCopied ? (
                              <Check size={15} />
                            ) : (
                              <Copy size={15} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* CARD FOOTER */}

                      <div className="mt-4 flex items-center justify-between">
                        <span
                          className={`text-[8px] font-medium uppercase tracking-[0.17em] transition-colors ${
                            isCopied
                              ? 'text-[#7658c9]'
                              : 'text-[#a49aaa]'
                          }`}
                        >
                          {isCopied
                            ? 'Address copied'
                            : 'Copy wallet address'}
                        </span>

                        <ArrowUpRight
                          size={14}
                          className={`transition-all duration-300 ${
                            isCopied
                              ? 'text-[#7658c9]'
                              : 'text-[#c2b8ce] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#7658c9]'
                          }`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* ================================================= */}
              {/* SECURITY NOTICE */}
              {/* ================================================= */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    cryptoDetails.length * 0.08 + 0.1,
                  duration: 0.45,
                }}
                className="mt-6 rounded-2xl border border-[#dcd2ef] bg-[#f3effc] p-5 sm:p-6"
              >
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#7658c9] shadow-sm">
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#654b9a]">
                      Before sending
                    </p>

                    <p className="mt-2 text-xs leading-6 text-[#716681]">
                      Verify the wallet address and network carefully before
                      sending your payment. Cryptocurrency transactions are
                      generally irreversible.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <div className="border-t border-[#e5dff0] bg-white px-6 py-5 sm:px-9">
              <div className="flex items-center justify-between gap-5">
                <div className="hidden sm:block">
                  <p className="text-[8px] font-medium uppercase tracking-[0.22em] text-[#aaa1b4]">
                    Payment / Cryptocurrency
                  </p>

                  <p className="mt-1 text-[9px] text-[#b0a7b8]">
                    Confirm your network before sending
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closePayment}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#7658c9] px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_25px_rgba(118,88,201,0.18)] transition-all duration-300 hover:bg-[#684bb9] hover:shadow-[0_14px_30px_rgba(118,88,201,0.25)] sm:w-auto"
                >
                  Close

                  <X
                    size={14}
                    className="transition-transform duration-300 group-hover:rotate-90"
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Payment;
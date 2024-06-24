import { CSSTransition, TransitionGroup, SwitchTransition } from 'react-transition-group';
import { useState, useEffect, useMemo } from 'react';
import { ImageLoader } from '@/utils/helpers';
import classNames from 'classnames';
import Image from 'next/image';

// Card types regex patterns.
const CARDS = {
    visa: '^4',
    amex: '^(34|37)',
    mastercard: '^5[1-5]',
    discover: '^6011',
    unionpay: '^62',
    troy: '^9792',
    diners: '^(30[0-5]|36)' 
};

const Card = ({
    isAdmin,
    cardHolder,
    cardNumber,
    cardCvv,
    isCardFlipped,
    currentFocusedElm,
    onCardElementClick,
    cardNumberRef,
    cardHolderRef,
    cardDateRef,
    cardDate
}) => {
    const [style, setStyle] = useState(null);

    // Initialize card number or use placeholder.
    const cardNumberInit = cardNumber || "#### #### #### ####";

    // Extract month and year from cardDate․
    const month = cardDate ? (cardDate.month() + 1).toString(): "";
    const year = cardDate ? cardDate.year(): "";


    // Update style whenever the focused element or card details change․
    useEffect(() => {
        if (currentFocusedElm) {
            const style = outlineElementStyle(currentFocusedElm.current);
            setStyle(style);
        };
    }, [currentFocusedElm, cardHolder, cardNumber]);


    // Memoized card type to optimize performance․
    const useCardType = useMemo(() => {
        cardType(cardNumberInit);
    }, [cardNumberInit]);


    // Function to mask the card number except for the last 4 digits․
    const maskCardNumber = (cardNumberInit) => {
        let cardNumberArr = cardNumberInit.split('');
        const isAmericanExpress = Boolean(cardNumberInit.split(' ').find(chars => chars.length === 5));

        // Return full card number if user is admin
        if(isAdmin) {
            return cardNumberArr;
        };

        // Replace digits with '*' except for the last 4 (or 3 for American Express).
        cardNumberArr.forEach((val, index) => {
            if (index < (isAmericanExpress ? 13 : 14)) {
                if (cardNumberArr[index] !== ' ') {
                    cardNumberArr[index] = '*';
                };
            }
        });

        // Return masked card number array.
        return cardNumberArr;
    };


    // Function to outline the focused element․
    function outlineElementStyle(element) {
        if(!element) {
            return null;
        };

        // Return the style object with element's dimensions and position.
        return {
            width: `${element.offsetWidth}px`,
            height: `${element.offsetHeight > 61 ? 61 : element.offsetHeight}px`,
            transform: `translateX(${element.offsetLeft}px) translateY(${element.offsetTop}px)`
        };
    };

    // Function to determine card type based on card number․
    function cardType(cardNumberInit) {
        const number = cardNumberInit;
        let regExp;
        for (const [card, pattern] of Object.entries(CARDS)) {
            regExp = new RegExp(pattern);
            if (number.match(regExp) != null) {
                return card;
            };
        };

        return '';
    };

    return (
        <div className={classNames('card-item', { "-active": isCardFlipped })}>
            <div className="card-item__side -front">
                <div
                    className={classNames('card-item__focus', { "-active": currentFocusedElm })}
                    style={style}
                />
                <div className="card-item__cover">
                    <Image
                        className='card-item__bg'
                        src="/assets/images/card.png"
                        quality={100}
                        width={430}
                        height={270}
                        loader={ImageLoader}
                        alt="credit card"
                    />
                </div>

                <div className="card-item__wrapper">
                    <div className="card-item__top">
                        <Image
                            className='card-item__chip'
                            src="/assets/images/chip.png"
                            quality={100}
                            width={60}
                            height={49}
                            loader={ImageLoader}
                            alt="credit card chip"
                        />
                        <div className="card-item__type">
                            { useCardType && (
                                <Image
                                    className='card-item__typeImg'
                                    src={`/assets/card-type/${useCardType}.png`}
                                    quality={100}
                                    width={100}
                                    height={45}
                                    loader={ImageLoader}
                                    alt={useCardType}
                                />
                            )}
                        </div>
                    </div>

                    <label
                        className="card-item__number"
                        ref={cardNumberRef}
                        onClick={() => onCardElementClick('cardNumber')}
                    >
                        <TransitionGroup className="slide-fade-up" component="div">
                            {cardNumberInit ? (
                                maskCardNumber(cardNumberInit).map((val, index) => (
                                    <CSSTransition classNames="slide-fade-up" timeout={250} key={index}>
                                        <div className="card-item__numberItem">{val}</div>
                                    </CSSTransition>
                                ))
                            ) : (
                                <CSSTransition classNames="slide-fade-up" timeout={250}>
                                    <div className="card-item__numberItem">#</div>
                                </CSSTransition>
                            )}
                        </TransitionGroup>
                    </label>
                    <div className="card-item__content">
                        <label
                            className="card-item__info"
                            onClick={() => onCardElementClick('cardHolder')}
                            ref={cardHolderRef}
                        >
                            <div className="card-item__holder">Card Holder</div>
                            <div className="card-item__name">
                                <TransitionGroup component="div" className="slide-fade-up">
                                    {!cardHolder ? (
                                        <CSSTransition classNames="slide-fade-up" timeout={250}>
                                            <div>FULL NAME</div>
                                        </CSSTransition>
                                    ) : (
                                        cardHolder
                                            .split('')
                                            .map((val, index) => (
                                                <CSSTransition
                                                    timeout={250}
                                                    classNames="slide-fade-right"
                                                    key={index}
                                                >
                                                    <span className="card-item__nameItem">
                                                        {val}
                                                    </span>
                                                </CSSTransition>
                                            ))
                                    )}
                                </TransitionGroup>
                            </div>
                        </label>
                        <div
                            className="card-item__date"
                            onClick={() => onCardElementClick('cardDate')}
                            ref={cardDateRef}
                        >
                            <label className="card-item__dateTitle">Expires</label>
                            <label className="card-item__dateItem">
                                <SwitchTransition in-out>
                                    <CSSTransition
                                        classNames="slide-fade-up"
                                        timeout={200}
                                        key={month}
                                    >
                                        <span>
                                            {!month ? 'MM' : month.length < 2 ? "0" + month : month}{' '}
                                        </span>
                                    </CSSTransition>
                                </SwitchTransition>
                            </label>
                            /
                            <label htmlFor="cardYear" className="card-item__dateItem">
                                <SwitchTransition out-in>
                                    <CSSTransition
                                        classNames="slide-fade-up"
                                        timeout={250}
                                        key={year}
                                    >
                                        <span>
                                            {!year ? 'YY' : year.toString().substr(-2)}
                                        </span>
                                    </CSSTransition>
                                </SwitchTransition>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-item__side -back">
                <div className="card-item__cover">
                    <Image
                        className='card-item__bg'
                        src="/assets/images/card.png"
                        quality={100}
                        width={430}
                        height={270}
                        loader={ImageLoader}
                        alt="credit card"
                    />
                </div>
                <div className="card-item__band" />
                <div className="card-item__cvv">
                    <div className="card-item__cvvTitle">CVV</div>
                    <div className="card-item__cvvBand">
                        <TransitionGroup>
                            {cardCvv.split('').map((val, index) => (
                                <CSSTransition
                                    classNames="zoom-in-out"
                                    key={index}
                                    timeout={250}
                                >
                                    <span>*</span>
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                    </div>
                    <div className="card-item__type">
                        { useCardType && (
                            <Image
                                className='card-item__typeImg'
                                src={`/assets/card-type/${useCardType}.png`}
                                quality={100}
                                width={100}
                                height={45}
                                loader={ImageLoader}
                                alt={useCardType}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
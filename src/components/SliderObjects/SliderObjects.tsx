import React, { useState, useRef } from "react";
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PrevIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import NextIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { IconButton, Dialog, DialogContent } from "@mui/material";

interface SliderObjectsProps {
    urls: string[];
}

const SliderObjects: React.FC<SliderObjectsProps> = ({ urls }) => {
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const sliderRef = useRef<Slider | null>(null);

    const handleClickImage = (url: string) => {
        setSelectedImage(url);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const PrevArrow: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
        <IconButton onClick={onClick}>
            <PrevIcon style={{ color: "#53bce5", fontSize: "30px" }} />
        </IconButton>
    );

    const NextArrow: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
        <IconButton onClick={onClick}>
            <NextIcon style={{ color: "#53bce5", fontSize: "30px" }} />
        </IconButton>
    );

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        prevArrow: <PrevArrow onClick={() => sliderRef.current?.slickPrev()} />,
        nextArrow: <NextArrow onClick={() => sliderRef.current?.slickNext()} />,
    };

    return (
        <div className="slider-container" style={{ maxWidth: "10rem" }}>
            {urls.length > 1 ? (
                <>
                    <Slider {...settings} ref={sliderRef}>
                        {urls.map((url, index) => (
                            <div key={index}>
                                <img
                                    src={url}
                                    onClick={() => handleClickImage(url)}
                                    style={{
                                        width: 120,
                                        height: 120,
                                        objectFit: 'contain',
                                        backgroundColor: "#c3c3c3",
                                        borderRadius: "10%",
                                        boxShadow: "4px 4px 16px rgba(0, 0, 0, 0.2)",
                                        cursor: 'pointer'
                                    }}
                                    alt={`Slide ${index}`}
                                />
                            </div>
                        ))}
                    </Slider>
                </>
            ) : (
                <img
                    src={urls[0]}
                    onClick={() => handleClickImage(urls[0])}
                    style={{
                        width: 120,
                        height: 120,
                        objectFit: 'contain',
                        backgroundColor: "#c3c3c3",
                        borderRadius: "10%",
                        boxShadow: "4px 4px 16px rgba(0, 0, 0, 0.2)",
                        cursor: 'pointer'
                    }}
                    alt="Single Image"
                />
            )}

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    style: {
                        backgroundColor: "#f0f0f0",
                        boxShadow: "10px 20px 30px rgba(0, 0, 0, 0.8)",
                        borderRadius: "30px",
                        width: "100%",
                        height: "100%",
                        border: "4px solid #000"
                    }
                }}
                sx={{ backdropFilter: "blur(5px)" }}
            >
                <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
                    <img
                        src={selectedImage}
                        style={{
                            width: "auto",
                            height: 'auto',
                            objectFit: "cover",
                            borderRadius: "30px",
                            boxShadow: "10px 20px 30px rgba(0, 0, 0, 0.8)",
                            border: "3px dotted #000"
                        }}
                        alt="Expanded"
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SliderObjects;

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ProductDetail } from './types';

type ProductGalleryProps = {
  product: ProductDetail;
};

const ProductGallery = ({ product }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(product.gallery[0]);

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)] border border-border/60"
      >
        <img
          src={selectedImage}
          alt={product.name}
          className="h-[420px] w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {product.badges.map((badge) => (
            <span key={badge} className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-md">
              {badge}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-4 gap-3">
        {product.gallery.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setSelectedImage(image)}
            className={`overflow-hidden rounded-2xl border-2 transition-all duration-300 ${selectedImage === image ? 'border-primary shadow-md' : 'border-transparent hover:border-primary/40'}`}
          >
            <img src={image} alt={`${product.name} thumbnail`} className="h-24 w-full object-cover hover:scale-110 transition-transform duration-300" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;

$fn=100;
ff=0.5;
x=16.2;
y=21.5;
z=2.5;

module rc(rx, ry, rz, dx, dy, dz) {
    translate([
        (x/2*-1)+rx-(dx/2*-1),
        (y/2*-1)+ry-(dy/2*-1),
        (z/2*-1)+rz-(dz/2*-1)
    ]) cube([dx+ff, dy+ff, dz+ff], true);
}

module ESPKey() {
    difference() {
        union() {
            cube([x+ff,y+ff,z+ff], true);
            rc(.5,.4,z, 5,20.5,5.6);
            rc(x-4-.4,y-4-1,z, 4,4,1.6);
            rc(6,y-6-1,z, 4,6,1.6);
            rc(6,5,z, 3,9.5,1);
            rc(x-4.5,12.25,z, 4.5,3,1);
            rc(10,y-4.5-.5,z, 1.5,4.5,.4);
            rc(9,5,z, 7,8.5,.4);
        }
        translate([3.35+ff/2,-8.25-ff/2,0.85+ff/2]) 
            cube([9.5,5,0.8], true);
    }
}

difference() {
    fx=35;
    fy=30;
    fz=11;
    cube([fx, fy, fz], true);
    zoff=fz/2-(2.5+ff)/2+1;
    translate([5.4,0,zoff]) rotate([180,0,0]) ESPKey();

    //piano-wire trenches
    translate([-5.5,-8,0]) cube([17,1.1,fz+1], true);
    translate([-5.5,-4,0]) cube([17,1.1,fz+1], true);
    translate([-5.5,0,0]) cube([17,1.1,fz+1], true);
    translate([-5.5,4,0]) cube([17,1.1,fz+1], true);
    translate([-5.5,8,0]) cube([17,1.1,fz+1], true);
    
    //toothpick holes
    translate([-3.8,15,zoff-5.25]) rotate([90,0,0]) cylinder(30,r=1,true);
    translate([-12,15,zoff-1.5]) rotate([90,0,0]) cylinder(30,r=1,true);

    //piano-wire holes
    translate([-10,-8,zoff-0.5]) rotate([0,270,0]) cylinder(10,d=1,true);
    translate([-10,-4,zoff-0.5]) rotate([0,270,0]) cylinder(10,d=1,true);
    translate([-10,0,zoff-0.5]) rotate([0,270,0]) cylinder(10,d=1,true);
    translate([-10,4,zoff-0.5]) rotate([0,270,0]) cylinder(10,d=1,true);
    translate([-10,8,zoff-0.5]) rotate([0,270,0]) cylinder(10,d=1,true);

    //finger holes
    translate([5.5,-17.5,zoff+2.5]) sphere(d=15);
    translate([5.5,17.5,zoff+2.5]) sphere(d=15);
}